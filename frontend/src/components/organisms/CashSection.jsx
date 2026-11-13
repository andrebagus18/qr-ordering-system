import { Clock } from "lucide-react";
import OrderItem from "../molecules/OrderItem";

const CashSection = ({ getOrders }) => {
  const cashOrders = getOrders.filter((item) => {
    return item.payments?.some((payment) => payment.payment_method === "CASH");
  });

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={24} className="text-yellow-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Konfirmasi Pembayaran Cash
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 h-auto">
        {cashOrders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            action={
              <button className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 cursor-pointer">
                Bayar
              </button>
            }
          />
        ))}
        {cashOrders.length === 0 && (
          <p className="p-5 text-sm text-white">
            Tidak ada pembayaran Cash yang menunggu konfirmasi.
          </p>
        )}
      </div>
    </section>
  );
};

export default CashSection;
