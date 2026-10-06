import { ShoppingCart } from "lucide-react";
import Logo from "../atoms/Logo";
import SearchBar from "../molecules/SearchBar";
import { Button } from "@/components/ui/button";

const Header = ({ search, onSearchChange, cartCount = 0, onCartClick }) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Logo />

        <div className="flex-1">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="relative shrink-0"
          onClick={onCartClick}
        >
          <ShoppingCart />

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
