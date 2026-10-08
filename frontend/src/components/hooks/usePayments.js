import { showError } from "@/lib/alert";
import { createPayment } from "@/services/payment.services";
import { useState } from "react";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);

  const create = async (data) => {
    try {
      setLoading(true);
      const response = await createPayment(data);
      setPayment(response.data);
      return response;
    } catch (error) {
      showError(error.response?.data?.msg || "Gagal membuat pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return {
    payment,
    loading,
    create,
  };
}
