import api from "@/services/api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
