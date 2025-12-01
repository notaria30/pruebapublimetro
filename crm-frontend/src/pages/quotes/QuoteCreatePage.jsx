// src/pages/quotes/QuoteCreatePage.jsx
import { useNavigate } from "react-router-dom";
import { createQuote } from "../../services/quoteService";
import QuoteForm from "./QuoteForm";
import { Box, Button, Typography } from "@mui/material";

function QuoteCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const res = await createQuote(payload);
    alert("Cotización creada correctamente");
    navigate(`/quotes/${res.data.quote._id}`);
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: 24 }}>

      {/* 🟢 TÍTULO ESTILO "NUEVO CLIENTE" */}
      <Typography variant="h4" fontWeight={700} mb={2}>
        Nueva Cotización
      </Typography>

      {/* 🔙 BOTÓN VOLVER EXACTAMENTE COMO EN CLIENTES */}
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)}
      >
        VOLVER
      </Button>

      {/* FORMULARIO */}
      <QuoteForm
        mode="create"
        onSubmit={handleCreate}
      />
    </div>
  );
}

export default QuoteCreatePage;
