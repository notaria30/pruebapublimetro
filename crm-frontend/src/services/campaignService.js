// src/services/campaignService.js
import api from "./api";

const tokenHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCampaigns = () =>
  api.get("/campaigns", tokenHeader());

export const getCampaignById = (id) =>
  api.get(`/campaigns/${id}`, tokenHeader());

export const createCampaign = (data) =>
  api.post("/campaigns", data, tokenHeader());

export const updateCampaign = (id, data) =>
  api.put(`/campaigns/${id}`, data, tokenHeader());

export const deleteCampaign = (id) =>
  api.delete(`/campaigns/${id}`, tokenHeader());

// Obtener campañas de un cliente
export const getCampaignsByClient = (clientId) =>
  api.get(`/campaigns?client=${clientId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
