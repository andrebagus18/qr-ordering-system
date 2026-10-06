import { useMemo, useState } from "react";

import CustomerLayout from "../templates/CustomerLayout";
import MenuGrid from "../organisms/MenuGrid";
import CartSummaryBar from "../organisms/CartSummaryBar";

const products = [
  {
    id: 1,
    name: "Caramel Latte",
    description: "Espresso, susu, dan caramel",
    price: 22000,
    image: "https://placehold.co/600x600",
    is_available: true,
  },
  {
    id: 2,
    name: "Americano",
    description: "Espresso dengan air",
    price: 18000,
    image: "https://placehold.co/600x600",
    is_available: true,
  },
  {
    id: 3,
    name: "Croissant",
    description: "Croissant butter yang renyah",
    price: 15000,
    image: "https://placehold.co/600x600",
    is_available: true,
  },
];

const MenuPage = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const handleIncrease = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const handleDecrease = (product) => {
    setCart((prev) => {
      const quantity = prev[product.id] || 0;

      if (quantity <= 1) {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      }

      return {
        ...prev,
        [product.id]: quantity - 1,
      };
    });
  };

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleRemove = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleCheckout = () => {
    console.log("Checkout:", cartItems);
  };

  return (
    <CustomerLayout
      search={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      cartCount={cartCount}
      cartOpen={cartOpen}
      onCartOpenChange={setCartOpen}
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
      onCheckout={handleCheckout}
    >
      <MenuGrid
        products={filteredProducts}
        cart={cart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />
      <CartSummaryBar
        itemCount={cartCount}
        total={cartTotal}
        onCheckout={handleCheckout}
      />
    </CustomerLayout>
  );
};

export default MenuPage;
