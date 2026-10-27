import { showError } from "@/lib/alert";
import { createOrder, updateOrder } from "../../services/order.services";
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

  const handleSubmit = async ({
    cartItems,
    orderType,
    customerName,
    orderId,
  }) => {
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

      const result = orderId
        ? await updateOrder(orderId, payload)
        : await createOrder(payload);

      setOrder(result.data);
      return result;
    } catch (error) {
      setError(error.response?.data?.msg || "Gagal menyimpan order");
      showError(error.response?.data?.msg || "Gagal menyimpan order");
      throw error;
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
