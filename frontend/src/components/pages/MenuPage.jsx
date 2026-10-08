import { useMemo, useState } from "react";
import CustomerLayout from "../templates/CustomerLayout";
import MenuGrid from "../organisms/MenuGrid";
import CartSummaryBar from "../organisms/CartSummaryBar";
import CategoryTabs from "../organisms/CategoryTab";
import TypeOrder from "../atoms/TypeOrder";
import { useProducts } from "../hooks/useProducts";

const MenuPage = () => {
  const {
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
  } = useProducts();

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
