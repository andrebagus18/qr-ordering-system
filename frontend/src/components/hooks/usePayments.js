import {
  createPayment,
  getPaymetStatus,
  cancelPayment,
} from "@/services/payment.services";
import { useState, useCallback } from "react";
import { showConfirm, showError } from "@/lib/alert";

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

  const getStatus = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await getPaymetStatus(id);
      return result.data;
    } catch (error) {
      showError(error.response?.data?.msg || "Gagal memua status pembayaran");
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmCancel = async (paymentId) => {
    const result = await showConfirm({
      title: "Batalkan pembayaran lama?",
      text: "QRIS sebelumnya masih aktif. Batalkan dan lanjutkan dengan pesanan terbaru?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Batalkan & Bayar",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return "BACK_TO_OLD_PAYMENT";
    }

    try {
      await cancelPayment(paymentId);
      return "CANCELLED";
    } catch (error) {
      showError(
        error.response?.data?.msg ||
          "Pembayaran lama belum berhasil dibatalkan",
      );
      return "FAILED";
    }
  };

  return {
    payment,
    loading,
    create,
    getStatus,
    confirmCancel,
  };
}
