import { ShoppingBag } from "lucide-react";
import OrderItem from "../molecules/OrderItem";

const IncomingSection = ({ getOrders }) => {
  const incomingOrders = getOrders.filter((item) => {
    return item.status === "PROCESSING";
  });

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Order Masuk</h2>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {incomingOrders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            action={
              <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 cursor-pointer">
                Tandai Selesai
              </button>
            }
          />
        ))}
        {incomingOrders.length === 0 && (
          <p className="p-5 text-sm text-gray-500">Belum ada order masuk.</p>
        )}
      </div>
    </section>
  );
};

export default IncomingSection;
