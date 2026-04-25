import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  updateIngrediente,
} from "../api/ingredientes.service";
import { IngredienteDetailModal } from "../components/modals/IngredienteDetailModal/IngredienteDetailModal";
import { IngredienteModal } from "../components/modals/ModalIngredientes/ModalIngredientes";
import { AlergenoBadge } from "../components/badges/AlergenoBadge";
import type { IIngrediente } from "../types/IIngrediente";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; ingrediente: IIngrediente }
  | { type: "detail"; ingrediente: IIngrediente };

export const IngredientesPage = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const handleCloseModal = () => setModal({ type: "none" });

  // ========== GET ==========
  const {
    data: ingredientes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    staleTime: 1000 * 60 * 5,
  });

  // ========== CREATE ==========
  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] }),
  });

  // ========== EDIT ==========
  const editMutation = useMutation({
    mutationFn: ({ id, ingrediente }: { id: string; ingrediente: Omit<IIngrediente, "id"> }) =>
      updateIngrediente(id, ingrediente),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] }),
  });

  // ========== DELETE ==========
  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] }),
  });

  if (isLoading) return <p className="p-8 text-center">Cargando ingredientes...</p>;
  if (isError) return <p className="p-8 text-center text-red-500">Error al cargar.</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ingredientes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{ingredientes.length} ingredientes en total</p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="text-base leading-none">+</span> Nuevo ingrediente
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-center font-medium">Alérgeno</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {ingredientes.map((ingrediente) => (
                <tr key={ingrediente.id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{ingrediente.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{ingrediente.descripcion || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    {ingrediente.es_alergeno
                      ? <AlergenoBadge />
                      : <span className="text-xs text-gray-400">No</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setModal({ type: "detail", ingrediente })}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Ver</button>
                      <button onClick={() => setModal({ type: "edit", ingrediente })}
                        className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">Editar</button>
                      <button onClick={() => deleteMutation.mutate(ingrediente.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ingredientes.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🥗</p>
              <p className="font-medium text-gray-600">No hay ingredientes todavía</p>
              <p className="text-sm mt-1">Creá el primero haciendo clic en "Nuevo ingrediente"</p>
            </div>
          )}
        </div>
      </div>

      {(modal.type === "create" || modal.type === "edit") && (
        <IngredienteModal
          ingredienteActive={modal.type === "edit" ? modal.ingrediente : null}
          handleCloseModal={handleCloseModal}
          handleCreate={(data) => createMutation.mutate(data)}
          handleEdit={(id, data) => editMutation.mutate({ id, ingrediente: data })}
        />
      )}
      {modal.type === "detail" && (
        <IngredienteDetailModal ingrediente={modal.ingrediente} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};
