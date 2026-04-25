import { Route, Routes } from "react-router-dom";
import { ProductosPage } from "../pages/ProductosPage";
import { ProductoDetailPage } from "../pages/ProductoDetailPage";
import { CategoriasPage } from "../pages/CategoriasPage";
import { IngredientesPage } from "../pages/IngredientesPage";
import { NavBar } from "../components/NavBar/NavBar";
import { CategoriaDetailPage } from "../pages/CategoriaDetailPage";

export const AppRouter = () => {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/"                  element={<ProductosPage />} />
          <Route path="/productos/:id"     element={<ProductoDetailPage />} />
          <Route path="/categorias"        element={<CategoriasPage />} />
          <Route path="/categorias/:id"    element={<CategoriaDetailPage />} />
          <Route path="/ingredientes"      element={<IngredientesPage />} />
          <Route path="*" element={
            <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
              <p className="text-5xl mb-4">🚫</p>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
              <p className="text-sm text-gray-500 mb-6">La ruta que buscás no existe.</p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
};
