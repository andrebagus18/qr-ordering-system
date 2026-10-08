import api from "./api";

export const createPayment = async (data) => {
  const response = await api.post("/payments", data);
  return response.data;
};
