import type { SyntheticEvent } from "react";
import type { ICategoria } from "../../../types/ICategoria";
import { useForm } from "../../../hooks/useForm";

type Props = {
  categoriaActive: ICategoria | null;
  categorias: ICategoria[];
  handleCloseModal: VoidFunction;
  handleCreate: (categoria: Omit<ICategoria, "id">) => void;
  handleEdit: (id: string, categoria: Omit<ICategoria, "id">) => void;
};

export const CategoriaModal = ({
  categoriaActive,
  categorias,
  handleCloseModal,
  handleCreate,
  handleEdit,
}: Props) => {
  const { formState, handleChange } = useForm({
    nombre: categoriaActive?.nombre ?? "",
    descripcion: categoriaActive?.descripcion ?? "",
    imagen_url: categoriaActive?.imagen_url ?? "",
    parent_id: categoriaActive?.parent_id ?? "",
  });

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Omit<ICategoria, "id"> = {
      nombre: formState.nombre,
      descripcion: formState.descripcion,
      imagen_url: formState.imagen_url,
      parent_id: formState.parent_id || null,
    };
    if (categoriaActive) {
      handleEdit(categoriaActive.id, data);
    } else {
      handleCreate(data);
    }
    handleCloseModal();
  };

  // Excluir la categoría que se está editando de las opciones de padre
  const opcionesPadre = categorias.filter((c) => c.id !== categoriaActive?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {categoriaActive ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <button onClick={handleCloseModal} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} id="categoria-form">
          <div className="px-6 py-5 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <input type="text" name="nombre" value={formState.nombre} onChange={handleChange}
                placeholder="Ej: Pizzas" required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Descripción</label>
              <textarea name="descripcion" value={formState.descripcion} onChange={handleChange}
                rows={3} placeholder="Descripción de la categoría"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Categoría padre (opcional)</label>
              <select name="parent_id" value={formState.parent_id ?? ""} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">— Sin categoría padre (raíz)</option>
                {opcionesPadre.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">URL de imagen (opcional)</label>
              <input type="text" name="imagen_url" value={formState.imagen_url} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          <button type="submit" form="categoria-form" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
            {categoriaActive ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};
