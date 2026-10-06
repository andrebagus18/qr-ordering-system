import { ShoppingBasket } from "lucide-react";
import Price from "../atoms/Price";
import { Button } from "@/components/ui/button";

const CartSummaryBar = ({ itemCount = 0, total = 0, onCheckout }) => {
  if (itemCount === 0) {
    return null;
  }
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl overflow-hidden rounded-lg bg-white border border-slate-300 shadow-xl">
      <div className="flex min-h-10 items-center py-2">
        <Button
          onClick={onCheckout}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex h-16 max-w-2xl items-center justify-between rounded-2xl px-5 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBasket className="size-6" />

              {/* <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-background text-xs text-primary">
                {itemCount}
              </span> */}
            </div>

            <div className="flex flex-col items-start">
              <span className="text-xs opacity-80">Total</span>

              <Price value={total} />
            </div>
          </div>

          <span className="font-bold">CHECK OUT ({itemCount})</span>
        </Button>
      </div>
    </div>
  );
};

export default CartSummaryBar;
