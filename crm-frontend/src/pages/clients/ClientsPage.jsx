// src/pages/clients/ClientsPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients } from "../../services/clientService";
import { useAuth } from "../../context/AuthContext";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

export default function ClientsPage() {
  const { isOwner, isWorker } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading)
    return (
      <Typography variant="body1" sx={{ p: 4 }}>
        Cargando clientes...
      </Typography>
    );

  // MISMA PALETA QUE COTIZACIONES (chips)
  const getStatusChip = (status) => {
    const value = status || "prospeccion";

    const label =
      value.charAt(0).toUpperCase() + value.slice(1);

    const colors = {
      prospeccion: "#F28C0F",
      presentacion: "#007BFF",
      negociacion: "#6C63FF",
      cerrado: "#2E7D32",
    };

    return (
      <Chip
        label={label}
        sx={{
          backgroundColor: colors[value] || "#9e9e9e",
          color: "white",
          fontWeight: 600,
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER, MISMO ESTILO QUE COTIZACIONES */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
          Clientes
        </Typography>

        {(isOwner || isWorker) && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#007BFF",
              textTransform: "none",
              fontSize: 15,
              px: 3,
              py: 1,
              borderRadius: "8px",
            }}
            component={Link}
            to="/clients/new"
          >
            Nuevo Cliente
          </Button>
        )}
      </Box>

      {/* TABLA */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0C8F44" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Nombre Comercial
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Razón Social
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                RFC
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Estatus
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Ejecutivo Asignado
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client._id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell>{client.nombreComercial}</TableCell>
                <TableCell>{client.razonSocial}</TableCell>
                <TableCell>{client.rfc}</TableCell>

                <TableCell>{getStatusChip(client.status)}</TableCell>

                <TableCell>{client.assignedTo?.name || "N/A"}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      px: 2,
                    }}
                    component={Link}
                    to={`/clients/${client._id}`}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
