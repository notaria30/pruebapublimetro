import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/reportService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";

export default function ReportAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getAnalytics();
      setData(res.data);
    }
    load();
  }, []);

  if (!data)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );

  const diferenciaPositiva = data.comparativo >= 0;

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Analítica de Ventas
      </Typography>

      {/* TARJETA PRINCIPAL */}
      <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={4}>
            
            {/* MES ACTUAL */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#F0F4FF",
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Ventas Mes Actual
                </Typography>
                <Typography variant="h4" fontWeight={700} mt={1}>
                  ${data.mesActual.toLocaleString("es-MX")}
                </Typography>
              </Card>
            </Grid>

            {/* MES ANTERIOR */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "#FFF5E6",
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Ventas Mes Anterior
                </Typography>
                <Typography variant="h4" fontWeight={700} mt={1}>
                  ${data.mesAnterior.toLocaleString("es-MX")}
                </Typography>
              </Card>
            </Grid>

            {/* DIFERENCIA */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: diferenciaPositiva ? "#E8F7EE" : "#FDEAEA",
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Diferencia
                </Typography>

                <Box mt={2}>
                  <Chip
                    label={
                      (diferenciaPositiva ? "+" : "") +
                      data.comparativo.toLocaleString("es-MX")
                    }
                    color={diferenciaPositiva ? "success" : "error"}
                    sx={{ fontSize: "1.1rem", px: 2, py: 2 }}
                  />
                </Box>
              </Card>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* VOLVER */}
      <Box mt={4}>
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
