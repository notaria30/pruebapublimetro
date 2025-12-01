// src/pages/invoices/InvoiceListPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInvoices } from "../../services/invoiceService";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip
} from "@mui/material";

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getInvoices();
        setInvoices(res.data);
      } catch (error) {
        console.error("Error cargando facturas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading)
    return (
      <Typography sx={{ p: 4 }} variant="body1">
        Cargando facturas...
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Facturación
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/invoices/new"
        >
          Crear nueva factura
        </Button>
      </Box>

      {/* TABLA */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0B8A42" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Cliente
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Folio Cotización
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Número Factura
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Fecha
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Importe
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Pagado
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    No hay facturas registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv._id} hover>
                  <TableCell>{inv.client?.nombreComercial}</TableCell>
                  <TableCell>{inv.quote?.folio}</TableCell>
                  <TableCell>{inv.numeroFactura}</TableCell>
                  <TableCell>
                    {inv.fechaFactura?.slice(0, 10) || "—"}
                  </TableCell>
                  <TableCell>
                    ${inv.importeConIVA?.toLocaleString("es-MX")}
                  </TableCell>

                  <TableCell>
                    {inv.pagado ? (
                      <Chip label="Sí" color="success" size="small" />
                    ) : (
                      <Chip label="No" color="error" size="small" />
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/invoices/${inv._id}`}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
