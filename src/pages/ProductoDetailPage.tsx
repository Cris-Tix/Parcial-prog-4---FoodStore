import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductoById } from "../api/productos.service";
import { getCategorias } from "../api/categorias.service";
import { getIngredientes } from "../api/ingredientes.service";
import { getIngredientesPorProducto } from "../api/productoIngrediente.service";
import { getCategoriasPorProducto } from "../api/productoCategoria.service";
import { EstadoBadge } from "../components/badges/EstadoBadge";
import { AlergenoBadge } from "../components/badges/AlergenoBadge";

export const ProductoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProductoById(Number(id)),
    enabled: !!id,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { data: todosIngredientes = [] } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    staleTime: 1000 * 60 * 5,
  });

  const { data: productoIngredientes = [] } = useQuery({
    queryKey: ["producto-ingredientes", id],
    queryFn: () => getIngredientesPorProducto(Number(id)),
    enabled: !!id,
  });

  const { data: productoCategorias = [] } = useQuery({
    queryKey: ["producto-categorias", id],
    queryFn: () => getCategoriasPorProducto(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-8 text-center">Cargando producto...</p>;
  if (isError || !producto)
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
      <p className="text-sm text-gray-500 mb-6">No existe ningún producto con ese ID.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
      >
        Volver a productos
      </button>
    </div>
  );
  const categoria = categorias.find(
    (c) => c.id === productoCategorias[0]?.categoria_id
  );

  const ingredientesDelProducto = productoIngredientes
    .map((pi) => todosIngredientes.find((i) => i.id === pi.ingrediente_id))
    .filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{producto.nombre}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex flex-col gap-5">
        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Categoría
          </span>
          {categoria ? (
            <span className="w-fit px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
              {categoria.nombre}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Sin categoría</span>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Descripción
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {producto.descripcion || "Sin descripción"}
          </p>
        </div>

        {/* Precio y Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Precio base
            </span>
            <span className="text-lg font-bold text-gray-900">
              ${producto.precio_base.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Estado
            </span>
            <EstadoBadge
              stock_cantidad={producto.stock_cantidad}
              disponible={producto.disponible}
            />
          </div>
        </div>

        {/* Stock y Disponible */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Stock actual
            </span>
            <span className="text-sm text-gray-700">
              {producto.stock_cantidad} unidades
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Disponible
            </span>
            <span
              className={`text-sm font-medium ${
                producto.disponible ? "text-green-600" : "text-red-500"
              }`}
            >
              {producto.disponible ? "Sí" : "No (deshabilitado)"}
            </span>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Ingredientes ({ingredientesDelProducto.length})
          </span>
          {ingredientesDelProducto.length === 0 ? (
            <p className="text-sm text-gray-400">Sin ingredientes asignados</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ingredientesDelProducto.map(
                (ing) =>
                  ing && (
                    <div
                      key={ing.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                    >
                      <span>{ing.nombre}</span>
                      {ing.es_alergeno && <AlergenoBadge />}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};