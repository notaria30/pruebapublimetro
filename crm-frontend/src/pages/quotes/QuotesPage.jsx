// src/pages/quotes/QuotesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
} from "@mui/material";
import { getQuotes, approveQuote, rejectQuote } from "../../services/quoteService";
import { useAuth } from "../../context/AuthContext";

export default function QuotesPage() {
  const { isOwner } = useAuth();
  const [tab, setTab] = useState("pendiente");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQuotes = async () => {
    try {
      const res = await getQuotes();
      setQuotes(res.data);
    } catch (err) {
      console.error("Error cargando cotizaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveQuote(id);
      loadQuotes();
    } catch (err) {
      alert("Error al aprobar cotización");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectQuote(id);
      loadQuotes();
    } catch (err) {
      alert("Error al rechazar cotización");
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const filtered = quotes.filter((q) => q.status === tab);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Cotizaciones
        </Typography>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  // Colors para chips
  const statusChip = {
    aprobado: { label: "Aprobada", color: "success" },
    pendiente: { label: "Pendiente", color: "warning" },
    rechazado: { label: "Rechazada", color: "error" },
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Cotizaciones
        </Typography>

        <Button
          component={Link}
          to="/quotes/new"
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Nueva cotización
        </Button>
      </Box>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label={`Pendientes (${quotes.filter(q => q.status === "pendiente").length})`}
            value="pendiente"
          />
          <Tab
            label={`Aprobadas (${quotes.filter(q => q.status === "aprobado").length})`}
            value="aprobado"
          />
          <Tab
            label={`Rechazadas (${quotes.filter(q => q.status === "rechazado").length})`}
            value="rechazado"
          />
        </Tabs>
      </Box>

      {/* TABLE */}
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#038449" }}>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Folio</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Cliente</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Total</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Creada</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.map((q) => (
            <TableRow key={q._id} hover>
              <TableCell>{q.folio}</TableCell>
              <TableCell>{q.client?.nombreComercial || "—"}</TableCell>
              <TableCell>${q.total?.toFixed(2)}</TableCell>

              <TableCell>
                <Chip
                  label={statusChip[q.status]?.label || q.status}
                  color={statusChip[q.status]?.color || "default"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                {new Date(q.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={1}>
                  {/* VER */}
                  <Button
                    component={Link}
                    to={`/quotes/${q._id}`}
                    variant="outlined"
                    size="small"
                  >
                    Ver
                  </Button>

                  {/* ACCIONES SOLO PARA OWNER Y SOLO SI ESTÁ PENDIENTE */}
                  {isOwner && q.status === "pendiente" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(q._id)}
                      >
                        Aprobar
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(q._id)}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
