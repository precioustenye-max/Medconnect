import API from "./api";

export const getAdminStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await API.get("/admin/users", { params });
  return response.data;
};

export const getAdminPharmacies = async (params = {}) => {
  const response = await API.get("/admin/pharmacies", { params });
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await API.get("/admin/orders", { params });
  return response.data;
};
