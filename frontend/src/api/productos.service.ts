import type { IProducto } from "../types/IProducto";

const BASE_URL = "http://localhost:8000/productos";

export const getProductos = async (): Promise<IProducto[]> => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const getProductosDisponibles = async (): Promise<IProducto[]> => {
  const response = await fetch(`${BASE_URL}/disponibles`);
  return response.json();
};

export const getProductoById = async (id: number): Promise<IProducto> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Producto no encontrado");
  }
  const data: IProducto = await response.json();
  return data;
};

export const createProducto = async (
  nuevo: Omit<IProducto, "id" | "created_at" | "updated_at">
): Promise<IProducto> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!response.ok) throw new Error("Error al crear producto");
  return response.json();
};

export const updateProducto = async (
  id: number,
  producto: Omit<IProducto, "id" | "created_at" | "updated_at">
): Promise<IProducto> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error("Error al actualizar producto");
  return response.json();
};

export const deleteProducto = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};