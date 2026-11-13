import { Clock } from "lucide-react";
import OrderItem from "../molecules/OrderItem";
import { useState } from "react";

const CashSection = ({ getOrders }) => {
  const [search, setSearch] = useState("");
  const cashOrders = getOrders.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.payments?.some((payment) => payment.payment_method === "CASH") &&
      (item.order_number?.toLowerCase().includes(keyword) ||
        item.customer_name?.toLowerCase().includes(keyword))
    );
  });

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={24} className="text-yellow-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Konfirmasi Pembayaran Cash
        </h2>
        <div className="mb-4 ml-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor order atau nama customer..."
            className="w-full border-b border-gray-100/50 px-2 py-1 outline-none focus:border-b-2 focus:border-white text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto">
        {cashOrders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            action={
              <button className="w-full min-w-0 rounded-md bg-green-500 p-1 sm:p-2 text-xs sm:text-sm text-white hover:bg-green-600 cursor-pointer">
                Bayar
              </button>
            }
          />
        ))}
        {cashOrders.length === 0 && (
          <p className="p-5 text-sm sm:text-lg text-white">
            Tidak ada pembayaran Cash ditemukan.!.
          </p>
        )}
      </div>
    </section>
  );
};

export default CashSection;
