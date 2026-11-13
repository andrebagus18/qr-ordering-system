import CashierStatus from "../atoms/CashierStatus";
import { formatRupiah } from "@/lib/utils";

const OrderItem = ({ order, action }) => {
  return (
    <div className="w-full min-w-0 bg-white/10 flex flex-col justify-between gap-3 border border-gray-100/50 py-4 px-2 sm:p-4 rounded-lg backdrop-blur-xl">
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-2 mb-2">
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {order.order_number}
          </p>
          <CashierStatus status={order.status} />
        </div>
        <p className="mt-1 text-sm text-white capitalize truncate">
          Customer: {order.customer_name}
        </p>
        <p className="mt-1 text-sm text-white">Meja: {order.table_id}</p>
        <p className="mt-1 font-medium text-gray-900">
          Total: {formatRupiah(order.total_amount)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="w-full min-w-0 items-center rounded-md bg-amber-500 p-1 sm:p-2 text-xs sm:text-sm text-white hover:bg-amber-600 cursor-pointer">
          Detail
        </button>
        {action}
      </div>
    </div>
  );
};

export default OrderItem;
