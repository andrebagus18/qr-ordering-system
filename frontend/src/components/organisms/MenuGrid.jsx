import MenuCard from "./MenuCard";

const MenuGrid = ({ products, cart, onIncrease, onDecrease }) => {
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
