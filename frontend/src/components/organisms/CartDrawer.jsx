import { Trash2 } from "lucide-react";
import Price from "../atoms/Price";
import QuantityControl from "../molecules/QuantityControl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

const CartDrawer = ({
  open,
  onOpenChange,
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pesanan Kamu</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Keranjang masih kosong
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{item.name}</h3>

                    <Price value={item.price} />

                    <div className="mt-2 flex items-center justify-between">
                      <QuantityControl
                        quantity={item.quantity}
                        onIncrease={() => onIncrease(item)}
                        onDecrease={() => onDecrease(item)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Subtotal</span>

              <Price value={subtotal} />
            </div>

            <Button className="w-full" onClick={onCheckout}>
              Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
