import API from "./api";

export const createPrescription = async (payload) => {
  const response = await API.post("/prescriptions", payload);
  return response.data;
};

export const getMyPrescriptions = async () => {
  const response = await API.get("/prescriptions/my");
  return response.data;
};

export const deleteMyPrescription = async (id) => {
  const response = await API.delete(`/prescriptions/${id}`);
  return response.data;
};

export const getMyPharmacyPrescriptions = async () => {
  const response = await API.get("/prescriptions/pharmacy/my");
  return response.data;
};

export const reviewPrescription = async (id, payload) => {
  const response = await API.patch(`/prescriptions/${id}/review`, payload);
  return response.data;
};
