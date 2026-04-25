import type { IProductoCategoria } from "../types/IProductoCategoria";

const BASE_URL = "http://localhost:8000/producto-categoria";

export const getCategoriasPorProducto = async (
  producto_id: number
): Promise<IProductoCategoria[]> => {
  const response = await fetch(`${BASE_URL}/producto/${producto_id}`);
  return response.json();
};

export const vincularCategoria = async (
  producto_id: number,
  categoria_id: number,
  es_principal: boolean = true
): Promise<void> => {
  await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id, categoria_id, es_principal }),
  });
};

export const desvincularCategoria = async (
  producto_id: number,
  categoria_id: number
): Promise<void> => {
  await fetch(`${BASE_URL}/${producto_id}/${categoria_id}`, {
    method: "DELETE",
  });
};