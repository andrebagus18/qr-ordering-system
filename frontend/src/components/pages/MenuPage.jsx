import { useMemo, useState } from "react";
import CustomerLayout from "../templates/CustomerLayout";
import MenuGrid from "../organisms/MenuGrid";
import CartSummaryBar from "../organisms/CartSummaryBar";
import CategoryTabs from "../organisms/CategoryTab";
import TypeOrder from "../atoms/TypeOrder";
import { useProducts } from "../hooks/useProducts";

const MenuPage = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("DINE-IN");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

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
      cartCount={cartCount}
      cartOpen={cartOpen}
      onCartOpenChange={setCartOpen}
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
      onCheckout={handleCheckout}
    >
      <TypeOrder value={orderType} onChange={setOrderType} />
      <CategoryTabs />
      <MenuGrid
        products={products}
        loading={loading}
        fetchProducts={fetchProducts}
        cart={cart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />
      <CartSummaryBar
        orderType={orderType}
        itemCount={cartCount}
        total={cartTotal}
        onCheckout={handleCheckout}
      />
    </CustomerLayout>
  );
};

export default MenuPage;
