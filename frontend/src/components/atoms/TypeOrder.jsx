import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TypeOrder = ({ value, onChange }) => {
  // const { logout } = useAuth();
  // const navigate = useNavigate();
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     navigate("/login", { replace: true });
  //   } catch (error) {
  //     console.error("Logout gagal:", error);
  //   }
  // };
  return (
    <div className="flex gap-2">
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
      {/* <Button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-red-500 hover:bg-red-50"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </Button> */}
    </div>
  );
};

export default TypeOrder;
