import { ShoppingBag } from "lucide-react";
import OrderItem from "../molecules/OrderItem";
import { useState } from "react";

const IncomingSection = ({ getOrders }) => {
  const [search, setSearch] = useState("");
  const incomingOrders = getOrders.filter((order) => {
    const keyword = search.toLowerCase();
    return (
      order.status === "PROCESSING" &&
      (order.order_number?.toLowerCase().includes(keyword) ||
        order.customer_name?.toLowerCase().includes(keyword))
    );
  });

  return (
    <section className="mb-4 sm:mb-6">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag size={24} className="text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Order Masuk</h2>
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
        {incomingOrders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            action={
              <button className="w-full min-w-0 rounded-md bg-blue-500 p-1 m:p-2 text-xs sm:text-sm text-white hover:bg-blue-600 cursor-pointer">
                Tandai Selesai
              </button>
            }
          />
        ))}
        {incomingOrders.length === 0 && (
          <p className="p-5 text-sm sm:text-lg text-white text-center">
            Order tidak ditemukan.!
          </p>
        )}
      </div>
    </section>
  );
};

export default IncomingSection;
