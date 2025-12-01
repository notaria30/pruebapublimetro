// src/pages/reports/ReportActivacionesPage.jsx

import { useEffect, useState } from "react";
import { getActivacionesReport } from "../../services/reportService";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

export default function ReportActivacionesPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getActivacionesReport();
      setData(res.data.activaciones || []);
    }
    load();
  }, []);

  /** COLUMNAS PARA EL DATAGRID */
  const columns = [
    {
      field: "cotizacion",
      headerName: "Cotización",
      flex: 1,
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1,
    },
    {
      field: "fechas",
      headerName: "Fechas",
      flex: 1.5,
      renderCell: (params) => params.row.fechas?.join(", "),
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      type: "number",
      flex: 0.6,
    },
    {
      field: "costo",
      headerName: "Costo",
      flex: 1,
      renderCell: (params) =>
        `$${params.row.costo?.toLocaleString("es-MX")}`,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* TÍTULO */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Activaciones
      </Typography>

      {/* CARD PRINCIPAL */}
      <Card elevation={4}>
        <CardContent>
          {data.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No hay activaciones registradas.
            </Typography>
          ) : (
            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={data.map((a, i) => ({ id: i, ...a }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                sx={{
                  borderRadius: 2,
                  background: "white",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* BOTÓN VOLVER */}
      <Box mt={3}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </Box>
    </Container>
  );
}
