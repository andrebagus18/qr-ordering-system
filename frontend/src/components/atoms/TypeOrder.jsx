import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TypeOrder = ({ value, onChange }) => {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {value === "DINE-IN"
              ? "Dine In"
              : value === "TAKE-AWAY"
                ? "Take Away"
                : "Pilih tipe pesanan..."}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DINE-IN">Dine In</SelectItem>
          <SelectItem value="TAKE-AWAY">Take Away</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeOrder;
