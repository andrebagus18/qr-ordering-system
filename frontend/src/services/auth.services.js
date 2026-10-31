import api from "@/services/api";
import axios from "axios";

export const login = async (credentials) => {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true,
    withXSRFToken: true,
  });
  const response = await api.post("/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/user");
  return response.data;
};
