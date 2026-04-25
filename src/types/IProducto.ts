export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagenes_url: string | null;
  stock_cantidad: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}