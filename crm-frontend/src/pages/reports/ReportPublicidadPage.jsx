import { useEffect, useState } from "react";
import { getPublicidadReport } from "../../services/reportService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider,
} from "@mui/material";

export default function ReportPublicidadPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getPublicidadReport();
      setData(res.data);
    }
    load();
  }, []);

  if (!data)
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Cargando reporte...
      </Typography>
    );

  return (
    <Box maxWidth="1100px" mx="auto" mt={4}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        📢 Reporte de Publicidad por Periodo
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Resumen General
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Periodo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Diario</TableCell>
                <TableCell>
                  ${data.totalPorDia.toLocaleString("es-MX")}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Semanal</TableCell>
                <TableCell>
                  ${data.totalPorSemana.toLocaleString("es-MX")}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Mensual</TableCell>
                <TableCell>
                  ${data.totalPorMes.toLocaleString("es-MX")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.history.back()}
            >
              Volver
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
