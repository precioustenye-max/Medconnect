import API from "./api";

export const getPublicPharmacies = async (params = {}) => {
  const response = await API.get("/public/pharmacies", { params });
  return response.data;
};

export const getPublicPharmacyById = async (id) => {
  const response = await API.get(`/public/pharmacies/${id}`);
  return response.data;
};

export const getPublicPharmacyDrugs = async (id, params = {}) => {
  const response = await API.get(`/public/pharmacies/${id}/drugs`, { params });
  return response.data;
};

export const getPublicDrugs = async (params = {}) => {
  const response = await API.get("/public/drugs", { params });
  return response.data;
};

export const getPublicDrugById = async (id) => {
  const response = await API.get(`/public/drugs/${id}`);
  return response.data;
};

export const getPublicDrugPharmacies = async (drugId) => {
  const response = await API.get(`/public/drugs/${drugId}/pharmacies`);
  return response.data;
};
