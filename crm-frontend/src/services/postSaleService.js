import api from "./api";

export const getPostSales = () => api.get("/postsale");

export const getPostSaleById = (id) => api.get(`/postsale/${id}`);

export const createPostSale = (data) => api.post("/postsale", data);

export const updatePostSale = (id, data) =>
  api.put(`/postsale/${id}`, data);

export const deletePostSale = (id) =>
  api.delete(`/postsale/${id}`);
