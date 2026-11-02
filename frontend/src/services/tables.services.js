import api from "./api";

export const getTableQr = async () => {
  const response = await api.get(`/tables/qr/${qrCode}`);
  return response.data;
};
