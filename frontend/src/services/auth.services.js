import api from "@/services/api";

export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};
