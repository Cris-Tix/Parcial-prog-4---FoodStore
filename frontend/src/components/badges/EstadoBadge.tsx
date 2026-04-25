type Props = {
  stock_cantidad: number;
  disponible: boolean;
};

export const EstadoBadge = ({ stock_cantidad, disponible }: Props) => {
  if (!disponible) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        No disponible
      </span>
    );
  }
  if (stock_cantidad === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Sin stock
      </span>
    );
  }
  if (stock_cantidad <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        Bajo: {stock_cantidad}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      {stock_cantidad} uds.
    </span>
  );
};
