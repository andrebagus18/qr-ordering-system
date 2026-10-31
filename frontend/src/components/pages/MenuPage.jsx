import { useEffect, useMemo, useState } from "react";
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
  const [activeCategory, setActiveCategory] = useState("");
  const handleClickCategory = (category) => {
    const section = document.getElementById(`category-${category}`);
    if (!section) return;
    const offset = 100;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
    setActiveCategory(category);
  };
  const groupCategory = products.reduce((groups, product) => {
    const category = product.category.name;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});
  useEffect(() => {
    const sections = document.querySelectorAll('section[id^="category-"]');
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - a.boundingClientRect.top);
        if (visibleSections.length > 0) {
          const id = visibleSections[0].target.id;
          const category = id.replace("category-", "");
          setActiveCategory(category);
        }
      },
      {
        rootMargin: "-112px 0px -60% 0px",
        threshold: 0,
      },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [products]);
  // console.log("products", products);
  // console.log("group", groupCategory);

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

      <CategoryTabs
        categories={Object.keys(groupCategory)}
        activeCategory={activeCategory}
        onSelect={handleClickCategory}
      />
      <div className="pb-16">
        {Object.entries(groupCategory).map(([category, items]) => (
          <section
            key={category}
            id={`category-${category}`}
            className="scroll mt-5"
          >
            <h2 className="mb-2 text-lg font-bold">{category}</h2>
            <MenuGrid
              products={items}
              loading={loading}
              fetchProducts={fetchProducts}
              cart={cart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </section>
        ))}
      </div>
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
