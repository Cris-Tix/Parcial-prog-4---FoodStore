import type { IProductoIngrediente } from "../types/IProductoIngrediente";

const BASE_URL = "http://localhost:8000/producto-ingrediente";

export const getIngredientesPorProducto = async (
  producto_id: number
): Promise<IProductoIngrediente[]> => {
  const response = await fetch(`${BASE_URL}/producto/${producto_id}`);
  return response.json();
};

export const vincularIngrediente = async (
  producto_id: number,
  ingrediente_id: number,
  es_removible: boolean = false
): Promise<IProductoIngrediente> => {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id, ingrediente_id, es_removible }),
  });
  return response.json();
};

export const desvincularIngrediente = async (
  producto_id: number,
  ingrediente_id: number
): Promise<void> => {
  await fetch(`${BASE_URL}/${producto_id}/${ingrediente_id}`, {
    method: "DELETE",
  });
};