export interface ICategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}