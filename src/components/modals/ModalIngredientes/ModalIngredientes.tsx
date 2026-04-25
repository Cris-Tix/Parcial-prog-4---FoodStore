import type { SyntheticEvent } from "react";
import type { IIngrediente } from "../../../types/IIngrediente";
import { useForm } from "../../../hooks/useForm";

type Props = {
  ingredienteActive: IIngrediente | null;
  handleCloseModal: VoidFunction;
  handleCreate: (ingrediente: Omit<IIngrediente, "id" | "created_at" | "updated_at">) => void;
  handleEdit: (id: number, ingrediente: Omit<IIngrediente, "id" | "created_at" | "updated_at">) => void;
};

export const IngredienteModal = ({
  ingredienteActive,
  handleCloseModal,
  handleCreate,
  handleEdit,
}: Props) => {
  const { formState, handleChange } = useForm({
    nombre: ingredienteActive?.nombre ?? "",
    descripcion: ingredienteActive?.descripcion ?? "",
    es_alergeno: ingredienteActive?.es_alergeno ?? false,
  });

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Omit<IIngrediente, "id" | "created_at" | "updated_at"> = {
      nombre: formState.nombre,
      descripcion: formState.descripcion,
      es_alergeno: formState.es_alergeno as unknown as boolean,
    };
    if (ingredienteActive) {
      handleEdit(Number(ingredienteActive.id), data);
    } else {
      handleCreate(data);
    }
    handleCloseModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {ingredienteActive ? "Editar ingrediente" : "Nuevo ingrediente"}
          </h2>
          <button onClick={handleCloseModal} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} id="ingrediente-form">
          <div className="px-6 py-5 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <input type="text" name="nombre" value={formState.nombre} onChange={handleChange}
                placeholder="Ej: Gluten (Harina de Trigo)" required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Descripción</label>
              <textarea name="descripcion" value={formState.descripcion} onChange={handleChange}
                rows={3} placeholder="Descripción del ingrediente"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            {/* es_alergeno toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">¿Es alérgeno?</p>
                <p className="text-xs text-gray-400">Se mostrará un badge de advertencia ⚠ en el menú</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="es_alergeno"
                  checked={formState.es_alergeno as unknown as boolean}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          <button type="submit" form="ingrediente-form" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
            {ingredienteActive ? "Guardar cambios" : "Crear ingrediente"}
          </button>
        </div>
      </div>
    </div>
  );
};
