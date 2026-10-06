import Header from "../organisms/Header";
import CartDrawer from "../organisms/CartDrawer";

const CustomerLayout = ({
  children,
  search,
  onSearchChange,
  cartCount,
  cartOpen,
  onCartOpenChange,
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        search={search}
        onSearchChange={onSearchChange}
        cartCount={cartCount}
        onCartClick={() => onCartOpenChange(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-4 relative -mt-16 rounded-t-3xl bg-background">
        {children}
      </main>

      <CartDrawer
        open={cartOpen}
        onOpenChange={onCartOpenChange}
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        onCheckout={onCheckout}
      />
    </div>
  );
};

export default CustomerLayout;
