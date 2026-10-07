import MenuCard from "./MenuCard";
import { LoaderCircle } from "lucide-react";

const MenuGrid = ({
  products,
  loading,
  fetchProducts,
  cart,
  onIncrease,
  onDecrease,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center mt-10">
        <LoaderCircle className="size-10 animate-spin" />
        <p className="text-md font-normal text-slate-300 mt-2">
          Please wait...
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <MenuCard
          key={product.id}
          product={product}
          quantity={cart[product.id] || 0}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      ))}
    </div>
  );
};

export default MenuGrid;
