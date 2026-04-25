import type { IIngrediente } from "../types/IIngrediente";

const BASE_URL = "http://localhost:8000/ingredientes";

export const getIngredientes = async (): Promise<IIngrediente[]> => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const getAlergenos = async (): Promise<IIngrediente[]> => {
  const response = await fetch(`${BASE_URL}/alergenos`);
  return response.json();
};

export const getIngredienteById = async (id: number): Promise<IIngrediente> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
};

export const createIngrediente = async (
  nuevo: Omit<IIngrediente, "id" | "created_at" | "updated_at">
): Promise<IIngrediente> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  return response.json();
};

export const updateIngrediente = async (
  id: number,
  ingrediente: Omit<IIngrediente, "id" | "created_at" | "updated_at">
): Promise<IIngrediente> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingrediente),
  });
  return response.json();
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};