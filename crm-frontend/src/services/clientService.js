import api from "./api";

export const getClients = () => api.get("/clients");
export const getClientById = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post("/clients", data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const checkRFC = (rfc) => api.get("/clients/check-rfc", { params: { rfc } });
export const checkClientName = (nombreComercial) => api.get("/clients/check-name", { params: { nombreComercial }});
