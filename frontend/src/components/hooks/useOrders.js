import { showError } from "@/lib/alert";
import { createOrder } from "../../services/order.services";
import { useState } from "react";

export function useOrders() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createOrder(data);
      setOrder(response.data);
      return response;
    } catch (error) {
      showError(error.response?.data?.msg || "Gagal mengambil order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({ cartItems, orderType, customerName }) => {
    const payload = {
      table_id: 1,
      customer_name: customerName,
      order_type: orderType,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
    try {
      setLoading(true);
      setError(null);
      const result = await create(payload);
      setOrder(result.data);
      return result;
    } catch (error) {
      showError(error.response?.data?.msg || "Gagal membuat order");
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    handleSubmit,
  };
}
