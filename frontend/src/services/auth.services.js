import api from "@/services/api";
import axios from "axios";

export const login = async (credentials) => {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true,
  });
  const response = await api.post("/login", credentials);
  return response.data;
};
