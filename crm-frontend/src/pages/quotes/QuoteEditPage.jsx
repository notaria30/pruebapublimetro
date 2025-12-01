// src/pages/quotes/QuoteEditPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { getQuoteById, updateQuote } from "../../services/quoteService";

// Usamos tu formulario bonito con secciones MUI
import QuoteForm from "./QuoteForm.jsx";

export default function QuoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar cotización desde el backend
  useEffect(() => {
    async function loadQuote() {
      try {
        const res = await getQuoteById(id);
        setQuote(res.data);
      } catch (err) {
        console.error("Error cargando cotización:", err);
        alert("Error cargando la cotización");
      } finally {
        setLoading(false);
      }
    }
    loadQuote();
  }, [id]);

  // Qué pasa cuando guardas el formulario
  const handleSubmit = async (payload) => {
    try {
      await updateQuote(id, payload);
      navigate(`/quotes/${id}`);
    } catch (err) {
      console.error("Error guardando cotización:", err);
      alert("Error al guardar la cotización");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quote) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          No se encontró la cotización.
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate("/quotes")}>
          Volver a cotizaciones
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado similar a clientes */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Editar cotización #{quote.folio}
        </Typography>

        <Button variant="outlined" onClick={() => navigate(`/quotes/${id}`)}>
          Volver
        </Button>
      </Box>

      {/* Formulario reutilizable con todas tus secciones MUI */}
      <QuoteForm
        mode="edit"
        initialQuote={quote}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
