// src/pages/reports/ReportProjectionsPage.jsx
import { useEffect, useState } from "react";
import { getProjections } from "../../services/reportService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
} from "@mui/material";

export default function ReportProjectionsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getProjections();
      setData(res.data);
    }
    load();
  }, []);

  if (!data) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">Cargando proyecciones...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Proyecciones de Ventas
      </Typography>

      {/* Tarjetas de Métricas */}
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Total de Propuestas
              </Typography>
              <Typography variant="h3" color="primary" fontWeight={700} mt={1}>
                {data.totalPropuestas}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Número total de cotizaciones enviadas en el periodo.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Total Potencial de Venta
              </Typography>
              <Typography variant="h3" color="success.main" fontWeight={700} mt={1}>
                ${Number(data.totalPotencial).toLocaleString("es-MX")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Monto económico potencial basado en propuestas activas.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
}
