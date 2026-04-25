import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategorias, getCategoriaById } from "../api/categorias.service";

export const CategoriaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: categoria, isLoading, isError } = useQuery({
    queryKey: ["categoria", id],
    queryFn: () => getCategoriaById(Number(id)),
    enabled: !!id,
  });

  const { data: todasCategorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p className="p-8 text-center">Cargando categoría...</p>;
  if (isError || !categoria)
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Categoría no encontrada</h2>
        <p className="text-sm text-gray-500 mb-6">No existe ninguna categoría con ese ID.</p>
        <button
          onClick={() => navigate("/categorias")}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          Volver a categorías
        </button>
      </div>
    );

  const padre = todasCategorias.find((c) => Number(c.id) === Number(categoria.parent_id));

  // Función recursiva para obtener todos los descendientes
  const getDescendientes = (parentId: number): typeof todasCategorias => {
    const hijas = todasCategorias.filter(
      (c) => Number(c.parent_id) === parentId
    );
    return hijas.flatMap((h) => [h, ...getDescendientes(h.id)]);
  };

  const subcategorias = todasCategorias.filter(
    (c) => Number(c.parent_id) === Number(categoria.id)
  );

  const todosDescendientes = getDescendientes(Number(categoria.id));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/categorias")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{categoria.nombre}</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Info principal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex flex-col gap-4">

          {/* Nivel */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Nivel</span>
            {padre ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                  Subcategoría
                </span>
                <span className="text-xs text-gray-400">de</span>
                <button
                  onClick={() => navigate(`/categorias/${padre.id}`)}
                  className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {padre.nombre}
                </button>
              </div>
            ) : (
              <span className="w-fit px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                Principal
              </span>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Descripción</span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {categoria.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Subcategorías directas
              </span>
              <span className="text-lg font-bold text-gray-900">{subcategorias.length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Total descendientes
              </span>
              <span className="text-lg font-bold text-gray-900">{todosDescendientes.length}</span>
            </div>
          </div>
        </div>

        {/* Subcategorías directas */}
        {subcategorias.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">
                Subcategorías directas ({subcategorias.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {subcategorias.map((sub) => {
                const nietas = todasCategorias.filter(
                  (c) => Number(c.parent_id) === Number(sub.id)
                );
                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-orange-50/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/categorias/${sub.id}`)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-800">{sub.nombre}</span>
                      {sub.descripcion && (
                        <span className="text-xs text-gray-400 truncate max-w-xs">{sub.descripcion}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {nietas.length > 0 && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {nietas.length} subcategorías
                        </span>
                      )}
                      <span className="text-gray-300 text-sm">▸</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {subcategorias.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 text-center text-gray-400">
            <p className="text-3xl mb-2">🏷️</p>
            <p className="text-sm">Esta categoría no tiene subcategorías</p>
          </div>
        )}
      </div>
    </div>
  );
};