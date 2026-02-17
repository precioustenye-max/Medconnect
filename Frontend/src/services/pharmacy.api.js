import API from "./api";

export const getMyPharmacyProfile = async () => {
  const response = await API.get("/pharmacies/me");
  return response.data;
};

export const updateMyPharmacyProfile = async (payload) => {
  const response = await API.patch("/pharmacies/me", payload);
  return response.data;
};

export const getMyPharmacyOrders = async () => {
  const response = await API.get("/pharmacies/me/orders");
  return response.data;
};

export const getMyDrugs = async () => {
  const response = await API.get("/drugs/my");
  return response.data;
};

export const addDrug = async (payload) => {
  const response = await API.post("/drugs", payload);
  return response.data;
};

export const updateDrug = async (id, payload) => {
  const response = await API.put(`/drugs/${id}`, payload);
  return response.data;
};

export const deleteDrug = async (id) => {
  const response = await API.delete(`/drugs/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await API.patch(`/orders/${id}/status`, { status });
  return response.data;
};
