import type { ICategoria } from "../types/ICategoria";

const BASE_URL = "http://localhost:8000/categorias";

export const getCategorias = async (): Promise<ICategoria[]> => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const getCategoriasRaiz = async (): Promise<ICategoria[]> => {
  const response = await fetch(`${BASE_URL}/raices`);
  return response.json();
};

export const getCategoriaById = async (id: number): Promise<ICategoria> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Categoría no encontrada");
  }
  return response.json();
};

export const createCategoria = async (
  nueva: Omit<ICategoria, "id" | "created_at" | "updated_at">
): Promise<ICategoria> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nueva),
  });
  return response.json();
};

export const updateCategoria = async (
  id: number,
  categoria: Omit<ICategoria, "id" | "created_at" | "updated_at">
): Promise<ICategoria> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  return response.json();
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};