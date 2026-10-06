import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ value, onChange, placehorder = "Cari menu..." }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placehorder={placehorder}
        className="pl-9"
      />
    </div>
  );
};

export default SearchBar;
