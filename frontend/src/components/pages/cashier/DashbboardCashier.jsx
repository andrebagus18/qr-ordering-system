import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import SummarySection from "@/components/organisms/SummarySection";
import CashSection from "@/components/organisms/CashSection";
import IncomingSection from "@/components/organisms/IncomingSection";
import QrisSection from "@/components/organisms/QrisSection";

const DashboardCashier = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Kasir</h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola pembayaran dan pesanan pelanggan.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <SummarySection />

      <CashSection />

      <IncomingSection />

      <QrisSection />
    </main>
  );
};

export default DashboardCashier;
