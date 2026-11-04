import { ShoppingBag } from "lucide-react";
import OrderItem from "../molecules/OrderItem";

const IncomingSection = () => {
  const incomingOrders = [
    {
      id: 3,
      order_number: "ORD-003",
      customer_name: "Sinta",
      total_amount: 42000,
      status: "processing",
    },
    {
      id: 4,
      order_number: "ORD-004",
      customer_name: "Rina",
      total_amount: 25000,
      status: "processing",
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag size={20} className="text-blue-600" />

        <h2 className="text-lg font-semibold text-gray-800">Order Masuk</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {incomingOrders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}

        {incomingOrders.length === 0 && (
          <p className="p-5 text-sm text-gray-500">Belum ada order masuk.</p>
        )}
      </div>
    </section>
  );
};

export default IncomingSection;
