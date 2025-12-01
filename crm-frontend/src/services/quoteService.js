// src/services/quoteService.js
import api from "./api";

export const getQuotes = () => api.get("/quotes");
export const getQuoteById = (id) => api.get(`/quotes/${id}`);
export const createQuote = (data) => api.post("/quotes", data);
export const updateQuote = (id, data) => api.put(`/quotes/${id}`, data);
export const deleteQuote = (id) => api.delete(`/quotes/${id}`);
export const approveQuote = (id) => api.put(`/quotes/${id}/approve`);
export const rejectQuote = (id) => api.put(`/quotes/${id}/reject`);
