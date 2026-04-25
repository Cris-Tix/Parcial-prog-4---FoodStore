import { useState, type SyntheticEvent } from "react";
import type { IProducto } from "../../../types/IProducto";
import type { ICategoria } from "../../../types/ICategoria";
import type { IIngrediente } from "../../../types/IIngrediente";
import { useForm } from "../../../hooks/useForm";

type Props = {
  productoActive: IProducto | null;
  categorias: ICategoria[];
  ingredientes: IIngrediente[];
  ingredientesAsignados: number[];
  categoriaAsignada: number | null;
  handleCloseModal: VoidFunction;
  handleCreate: (
    producto: Omit<IProducto, "id" | "created_at" | "updated_at">,
    categoria_id: number | null,
    ingredientesIds: number[]
  ) => void | Promise<void>;
  handleUpdate: (
    id: number,
    producto: Omit<IProducto, "id" | "created_at" | "updated_at">,
    categoria_id: number | null,
    ingredientesIds: number[]
  ) => void | Promise<void>;
};

export const ProductoModal = ({
  productoActive,
  categorias,
  ingredientes,
  ingredientesAsignados,
  categoriaAsignada,
  handleCloseModal,
  handleCreate,
  handleUpdate,
}: Props) => {
  const { formState, handleChange } = useForm({
    nombre: productoActive?.nombre ?? "",
    descripcion: productoActive?.descripcion ?? "",
    precio_base: productoActive ? productoActive.precio_base.toString() : "",
    stock_cantidad: productoActive ? productoActive.stock_cantidad.toString() : "",
    disponible: productoActive?.disponible ?? true,
  });

  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
    categoriaAsignada
  );
  const [selectedIngredientes, setSelectedIngredientes] =
    useState<number[]>(ingredientesAsignados);

  const toggleIngrediente = (id: number) => {
    setSelectedIngredientes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Omit<IProducto, "id" | "created_at" | "updated_at"> = {
      nombre: formState.nombre,
      descripcion: formState.descripcion,
      precio_base: Number(formState.precio_base),
      stock_cantidad: Number(formState.stock_cantidad),
      disponible: formState.disponible as unknown as boolean,
      imagenes_url: null,
};
    if (productoActive) {
      handleUpdate(productoActive.id, data, selectedCategoria, selectedIngredientes);
    } else {
      handleCreate(data, selectedCategoria, selectedIngredientes);
    }
    handleCloseModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {productoActive ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body scrolleable */}
        <form id="producto-form" onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="px-6 py-5 space-y-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formState.nombre}
                onChange={handleChange}
                placeholder="Ej: Pizza Margarita"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Precio base ($)</label>
                <input
                  type="number"
                  name="precio_base"
                  value={formState.precio_base}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Stock</label>
                <input
                  type="number"
                  name="stock_cantidad"
                  value={formState.stock_cantidad}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Categoría</label>
              <select
                value={selectedCategoria ?? ""}
                onChange={(e) =>
                  setSelectedCategoria(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Seleccioná una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Descripción</label>
              <textarea
                name="descripcion"
                value={formState.descripcion}
                onChange={handleChange}
                rows={2}
                placeholder="Descripción del producto"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Ingredientes */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Ingredientes{" "}
                <span className="text-gray-400 font-normal">
                  ({selectedIngredientes.length} seleccionados)
                </span>
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                {ingredientes.map((ing) => {
                  const checked = selectedIngredientes.includes(ing.id);
                  return (
                    <label
                      key={ing.id}
                      className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                        checked ? "bg-orange-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIngrediente(ing.id)}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-gray-800">{ing.nombre}</span>
                      {ing.es_alergeno && (
                        <span className="ml-auto text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                          ⚠ Alérgeno
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Disponible toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">¿Disponible?</p>
                <p className="text-xs text-gray-400">
                  Si está desactivado el operador lo oculta del menú
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formState.disponible as unknown as boolean}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="producto-form"
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            {productoActive ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
};