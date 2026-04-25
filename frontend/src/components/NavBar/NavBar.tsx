import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Productos", href: "/" },
  { label: "Categorías", href: "/categorias" },
  { label: "Ingredientes", href: "/ingredientes" },
];

export const NavBar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🍕</span>
          <span>FoodStore </span>
        </Link>

        <ul className="flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
