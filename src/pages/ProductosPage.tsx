import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProducto, deleteProducto, getProductos, updateProducto } from "../api/productos.service";
import { getCategorias } from "../api/categorias.service";
import { getIngredientes } from "../api/ingredientes.service";
import {
  getIngredientesPorProducto,
  vincularIngrediente,
  desvincularIngrediente,
} from "../api/productoIngrediente.service";
import {
  getCategoriasPorProducto,
  vincularCategoria,
  desvincularCategoria,
} from "../api/productoCategoria.service";
import { ProductoModal } from "../components/modals/ModalProductos/ModalProductos";
import { EstadoBadge } from "../components/badges/EstadoBadge";
import type { IProducto } from "../types/IProducto";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | {
      type: "edit";
      producto: IProducto;
      ingredientesAsignados: number[];
      categoriaAsignada: number | null;
    };

export const ProductosPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const handleCloseModal = () => setModal({ type: "none" });

  // ========== GET ==========
  const { data: productos = [], isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { data: ingredientes = [] } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    staleTime: 1000 * 60 * 5,
  });

  // Cargar categoría de cada producto para mostrar en tabla
  const { data: productosCategorias = [] } = useQuery({
    queryKey: ["productos-categorias", productos.map((p) => p.id)],
    queryFn: async () => {
      const results = await Promise.all(
        productos.map((p) =>
          getCategoriasPorProducto(p.id).then((cats) => ({
            producto_id: p.id,
            categoria_id: cats[0]?.categoria_id ?? null,
          }))
        )
      );
      return results;
    },
    enabled: productos.length > 0,
  });

  // ========== CREATE ==========
  const handleCreate = async (
    data: Omit<IProducto, "id" | "created_at" | "updated_at">,
    categoria_id: number | null,
    ingredientesIds: number[]
  ) => {
    const nuevoProducto = await createProducto(data);
    if (categoria_id) {
      await vincularCategoria(nuevoProducto.id, categoria_id);
    }
    for (const ingId of ingredientesIds) {
      await vincularIngrediente(nuevoProducto.id, ingId);
    }
    queryClient.invalidateQueries({ queryKey: ["productos"] });
    queryClient.invalidateQueries({ queryKey: ["productos-categorias"] });
  };

  // ========== EDIT ==========
  const handleUpdate = async (
    id: number,
     data: Omit<IProducto, "id" | "created_at" | "updated_at">,
    nueva_categoria_id: number | null,
    nuevosIngredientesIds: number[]
  ) => {
    await updateProducto(id, data);

    // Sincronizar categoría
    const categoriasActuales = await getCategoriasPorProducto(id);
    for (const pc of categoriasActuales) {
      await desvincularCategoria(id, pc.categoria_id);
    }
    if (nueva_categoria_id) {
      await vincularCategoria(id, nueva_categoria_id);
    }

    // Sincronizar ingredientes
    const actuales = await getIngredientesPorProducto(id);
    const actualesIds = actuales.map((i) => i.ingrediente_id);
    for (const ingId of actualesIds) {
      if (!nuevosIngredientesIds.includes(ingId)) {
        await desvincularIngrediente(id, ingId);
      }
    }
    for (const ingId of nuevosIngredientesIds) {
      if (!actualesIds.includes(ingId)) {
        await vincularIngrediente(id, ingId);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["productos"] });
    queryClient.invalidateQueries({ queryKey: ["productos-categorias"] });
  };

  // ========== DELETE ==========
  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["productos-categorias"] });
    },
  });

  // ========== ABRIR MODAL EDICIÓN ==========
  const handleOpenEdit = async (producto: IProducto) => {
    const asignados = await getIngredientesPorProducto(producto.id);
    const categoriasAsignadas = await getCategoriasPorProducto(producto.id);
    const categoriaId =
      categoriasAsignadas.length > 0 ? categoriasAsignadas[0].categoria_id : null;
    setModal({
      type: "edit",
      producto,
      ingredientesAsignados: asignados.map((i) => i.ingrediente_id),
      categoriaAsignada: categoriaId,
    });
  };

  if (isLoading) return <p className="p-8 text-center">Cargando productos...</p>;
  if (isError) return <p className="p-8 text-center text-red-500">Error al cargar.</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {productos.length} productos en total
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="text-base leading-none">+</span> Nuevo producto
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-right font-medium">Precio</th>
                <th className="px-4 py-3 text-center font-medium">Estado</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {productos.map((producto) => {
                const rel = productosCategorias.find(
                  (pc) => pc.producto_id === producto.id
                );
                const categoriaNombre =
                  categorias.find((c) => c.id === rel?.categoria_id)?.nombre ?? "—";

                return (
                  <tr
                    key={producto.id}
                    className="hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{categoriaNombre}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      ${producto.precio_base.toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <EstadoBadge
                        stock_cantidad={producto.stock_cantidad}
                        disponible={producto.disponible}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/productos/${producto.id}`)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleOpenEdit(producto)}
                          className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(producto.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {productos.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🍔</p>
              <p className="font-medium text-gray-600">No hay productos todavía</p>
              <p className="text-sm mt-1">
                Creá el primero haciendo clic en "Nuevo producto"
              </p>
            </div>
          )}
        </div>
      </div>

      {modal.type === "create" && (
        <ProductoModal
          productoActive={null}
          categorias={categorias}
          ingredientes={ingredientes}
          ingredientesAsignados={[]}
          categoriaAsignada={null}
          handleCloseModal={handleCloseModal}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
        />
      )}

      {modal.type === "edit" && (
        <ProductoModal
          productoActive={modal.producto}
          categorias={categorias}
          ingredientes={ingredientes}
          ingredientesAsignados={modal.ingredientesAsignados}
          categoriaAsignada={modal.categoriaAsignada}
          handleCloseModal={handleCloseModal}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
};