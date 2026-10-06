import ProductImage from "../atoms/ProductImage";
import Price from "../atoms/Price";
import QuantityControl from "../molecules/QuantityControl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MenuCard = ({ product, quantity = 0, onIncrease, onDecrease }) => {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg py-0">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <ProductImage src={product.image} alt={product.name} />

        {!product.is_available && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            Habis
          </Badge>
        )}
      </div>

      {/* Product Information */}
      <CardContent className="p-2">
        <div>
          <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
          <p className="line-clamp-2 min-h-10 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>

        <Price value={product.price} />

        {product.is_available && (
          <QuantityControl
            quantity={quantity}
            onIncrease={() => onIncrease(product)}
            onDecrease={() => onDecrease(product)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCard;
