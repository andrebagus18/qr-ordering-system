import CashierStatus from "../atoms/CashierStatus";
import { formatRupiah } from "@/lib/utils";

const OrderItem = ({ order, action }) => {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 last:border-0 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold text-gray-800">{order.order_number}</p>
        <p className="mt-1 text-sm text-gray-500">{order.customer_name}</p>
        <p className="mt-1 font-medium text-gray-800">
          {formatRupiah(order.total_amount)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <CashierStatus status={order.status} />
        {action}
      </div>
    </div>
  );
};

export default OrderItem;
