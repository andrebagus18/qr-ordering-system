import api from "./api";

export const createPayment = async (data) => {
  const response = await api.post("/payments", data);
  return response.data;
};

export const getPaymetStatus = async (id) => {
  const response = await api.get(`/payments/${id}/status`);
  return response.data;
};

export const cancelPayment = async (paymentId) => {
  const response = await api.post(`/payments/${paymentId}/cancel`);
};
