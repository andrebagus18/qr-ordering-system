import api from "./api";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const updateOrder = async (orderId, data) => {
  const response = await api.put(`/orders/${orderId}`, data);
  return response.data;
};

export const showOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const showMethodeOrders = async () => {
  const response = await api.get("/orders");
  console.log("services", response.data);
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const dashboard = async () => {
  const response = await api.get("/dashboard");
  // console.log("sum", response.data);
  return response.data;
};
