import api from "./api";

// Obtener todas las ventas
export const getSales = () =>
  api.get("/sales");

// Obtener una venta por ID
export const getSaleById = (id) =>
  api.get(`/sales/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// Actualizar etapa del pipeline
export const updateSale = (id, pipelineStage) =>
  api.put(
    `/sales/${id}`,
    { pipelineStage },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// Cerrar venta
export const closeSale = (id) =>
  api.put(
    `/sales/${id}/close`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// Crear venta desde cotización
export const createSaleFromQuote = (quoteId) =>
  api.post(
    "/sales",
    { quoteId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// ⭐ AGREGAR NOTA DE SEGUIMIENTO
export const addSaleNote = (id, text) =>
  api.post(
    `/sales/${id}/notes`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  export const addSaleTask = (id, title, dueDate) =>
  api.post(
    `/sales/${id}/tasks`,
    { title, dueDate },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

export const completeSaleTask = (id, taskId) =>
  api.put(
    `/sales/${id}/tasks/${taskId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
