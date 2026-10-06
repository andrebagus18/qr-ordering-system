import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={quantity <= 0}
      >
        <Minus />
      </Button>
      <span className="min-w-6 text-center font-medium">{quantity}</span>
      <Button variant="outline" size="icon" onClick={onIncrease}>
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityControl;
