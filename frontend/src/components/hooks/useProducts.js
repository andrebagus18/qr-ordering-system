import { showError } from "@/lib/alert";
import { getProducts } from "@/services/products.services";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [orderType, setOrderType] = useState("DINE-IN");
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      showError(error.response?.data?.msg || "Failed to load data products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems,
        orderType,
      },
    });
  };
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
  const handleRemove = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  return {
    products,
    loading,
    fetchProducts,
    cart,
    handleCheckout,
    handleIncrease,
    handleDecrease,
    handleRemove,
    cartItems,
    cartTotal,
    cartCount,
    orderType,
    setOrderType,
    cartOpen,
    setCartOpen,
  };
}
