import { ShoppingCart } from "lucide-react";
import Logo from "../atoms/Logo";
import { Button } from "@/components/ui/button";
import BackgroundImage from "../atoms/BackgroundImage";
import { useEffect, useState } from "react";

const Header = ({ cartCount = 0, onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scrollColor = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", scrollColor);
    return () => {
      window.removeEventListener("scroll", scrollColor);
    };
  }, []);
  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-white/20  shadow-2xl ${scrolled ? "bg-white" : "bg-white/15 backdrop-blur-[2px]"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <Logo />
          <div className="flex rounded-xl">
            <h3 className="font-semibold text-md">Meja 01</h3>
            {/* <SearchBar value={search} onChange={onSearchChange} /> */}
          </div>

          <Button
            size="icon"
            className="relative shrink-0 bg-slate-950/10"
            onClick={onCartClick}
          >
            <ShoppingCart
              className={scrolled ? "text-amber-600" : "text-black"}
            />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center bg-red-500 text-white rounded-full text-xs">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>
      <div className="relative">
        <BackgroundImage className="h-54 -mt-12" />
      </div>
    </>
  );
};

export default Header;
