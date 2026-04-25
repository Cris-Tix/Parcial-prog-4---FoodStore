import type { IIngrediente } from "../../../types/IIngrediente";
import { AlergenoBadge } from "../../badges/AlergenoBadge";

type Props = {
  ingrediente: IIngrediente;
  handleCloseModal: VoidFunction;
};

export const IngredienteDetailModal = ({ ingrediente, handleCloseModal }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Detalle de Ingrediente</h2>
          <button onClick={handleCloseModal} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-bold text-gray-900">{ingrediente.nombre}</p>
            {ingrediente.es_alergeno && <AlergenoBadge />}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Descripción</span>
            <p className="text-sm text-gray-700">{ingrediente.descripcion || "Sin descripción"}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">¿Es alérgeno?</span>
            <p className="text-sm text-gray-700">{ingrediente.es_alergeno ? "Sí — debe declararse en el menú" : "No"}</p>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
