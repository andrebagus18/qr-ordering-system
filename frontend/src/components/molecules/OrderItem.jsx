import CashierStatus from "../atoms/CashierStatus";
import { formatRupiah } from "@/lib/utils";

const OrderItem = ({ order, action }) => {
  return (
    <div className="bg-white/10 flex flex-col justify-between gap-3 border border-gray-100/50 p-4 rounded-lg backdrop-blur-xl">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-gray-900">{order.order_number}</p>
          <CashierStatus status={order.status} />
        </div>
        <p className="mt-1 text-md text-white capitalize">
          Customer: {order.customer_name}
        </p>
        <p className="mt-1 text-md text-white">Meja: {order.table_id}</p>
        <p className="mt-1 font-medium text-gray-900">
          Total: {formatRupiah(order.total_amount)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button className="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 cursor-pointer">
          Detail
        </button>
        {action}
      </div>
    </div>
  );
};

export default OrderItem;
