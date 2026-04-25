import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../api/categorias.service";
import { CategoriaDetailModal } from "../components/modals/CategoriaDetailModal/CategoriaDetailModal";
import { CategoriaModal } from "../components/modals/ModalCategorias/ModalCategorias";
import type { ICategoria } from "../types/ICategoria";
import { Navigate, useNavigate } from "react-router-dom";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; categoria: ICategoria }
  | { type: "detail"; categoria: ICategoria };

type NodoProps = {
  categoria: ICategoria;
  todas: ICategoria[];
  nivel: number;
  onVer: (c: ICategoria) => void;
  onEditar: (c: ICategoria) => void;
  onEliminar: (id: number) => void;
};

const NodoCategoria = ({
  categoria,
  todas,
  nivel,
  onVer,
  onEditar,
  onEliminar,
}: NodoProps) => {
  const [expandido, setExpandido] = useState(false);

  const hijas = todas.filter(
    (c) => Number(c.parent_id) === Number(categoria.id)
  );
  const tieneHijas = hijas.length > 0;
  
  const navigate = useNavigate();

  return (
    <>
      <tr className="hover:bg-orange-50/40 transition-colors">
        {/* Nombre con indentación y toggle */}
        <td className="px-4 py-3">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${nivel * 20}px` }}
          >
            {tieneHijas ? (
              <button
                onClick={() => setExpandido(!expandido)}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors shrink-0"
              >
                {expandido ? "▾" : "▸"}
              </button>
            ) : (
              <span className="w-5 h-5 shrink-0" />
            )}
            <span
              className="font-medium text-gray-800 hover:text-orange-500 cursor-pointer transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate(`/categorias/${categoria.id}`); }}
            >
              {categoria.nombre}
            </span>
            {tieneHijas && (
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {hijas.length}
              </span>
            )}
          </div>
        </td>

        {/* Descripción */}
        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
          {categoria.descripcion || "—"}
        </td>

        {/* Nivel */}
        <td className="px-4 py-3 text-center">
          {nivel === 0 ? (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              Principal
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
              Nivel {nivel}
            </span>
          )}
        </td>

        {/* Acciones */}
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onVer(categoria)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver
            </button>
            <button
              onClick={() => onEditar(categoria)}
              className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onEliminar(categoria.id)}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>

      {/* Hijas — se renderizan recursivamente solo si está expandido */}
      {expandido &&
        hijas.map((hija) => (
          <NodoCategoria
            key={hija.id}
            categoria={hija}
            todas={todas}
            nivel={nivel + 1}
            onVer={onVer}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        ))}
    </>
  );
};

// ─── Página principal ───
export const CategoriasPage = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const handleCloseModal = () => setModal({ type: "none" });

  // ========== GET ==========
  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  // ========== CREATE ==========
  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });

  // ========== EDIT ==========
  const editMutation = useMutation({
    mutationFn: ({
      id,
      categoria,
    }: {
      id: number;
      categoria: Omit<ICategoria, "id">;
    }) => updateCategoria(id, categoria),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });

  // ========== DELETE ==========
  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });

  // Solo las raíz para arrancar el árbol
  const categoriasRaiz = categorias.filter(
    (c) => c.parent_id === null || c.parent_id === undefined
  );

  if (isLoading) return <p className="p-8 text-center">Cargando categorías...</p>;
  if (isError) return <p className="p-8 text-center text-red-500">Error al cargar.</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {categorias.length} categorías en total
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="text-base leading-none">+</span> Nueva categoría
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-center font-medium">Nivel</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {categoriasRaiz.map((categoria) => (
                <NodoCategoria
                  key={categoria.id}
                  categoria={categoria}
                  todas={categorias}
                  nivel={0}
                  onVer={(c) => setModal({ type: "detail", categoria: c })}
                  onEditar={(c) => setModal({ type: "edit", categoria: c })}
                  onEliminar={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </tbody>
          </table>

          {categorias.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🏷️</p>
              <p className="font-medium text-gray-600">No hay categorías todavía</p>
              <p className="text-sm mt-1">
                Creá la primera haciendo clic en "Nueva categoría"
              </p>
            </div>
          )}
        </div>
      </div>

      {(modal.type === "create" || modal.type === "edit") && (
        <CategoriaModal
          categoriaActive={modal.type === "edit" ? modal.categoria : null}
          categorias={categorias}
          handleCloseModal={handleCloseModal}
          handleCreate={(data) => createMutation.mutate(data)}
          handleEdit={(id, data) => editMutation.mutate({ id: Number(id), categoria: data })}
        />
      )}

      {modal.type === "detail" && (
        <CategoriaDetailModal
          categoria={modal.categoria}
          categorias={categorias}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};