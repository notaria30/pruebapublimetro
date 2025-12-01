import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostSaleById, updatePostSale } from "../../services/postSaleService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

export default function PostSaleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);

  const STAGES = [
    "prospeccion",
    "acercamiento",
    "presentacion_contacto_indicado",
    "propuesta_comercial",
    "negociacion_cierre",
    "documentacion_contrato",
    "facturacion",
    "pago",
    "servicio_post_venta",
    "reportes",
  ];

  useEffect(() => {
    async function load() {
      const res = await getPostSaleById(id);
      setRecord(res.data);
    }
    load();
  }, [id]);

  if (!record) return <p style={{ padding: 20 }}>Cargando...</p>;

  const updateField = async (field, value) => {
    const res = await updatePostSale(id, { [field]: value });
    setRecord(res.data.updated);
  };

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={3}>
      {/* BOTÓN REGRESAR */}
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/postsale")}>
        ← Volver
      </Button>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Seguimiento Post-Venta
      </Typography>

      {/* CARD PRINCIPAL */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={700}>
                {record.client?.nombreComercial}
              </Typography>

              <Typography><strong>Venta:</strong> {record.sale?._id}</Typography>
              <Typography>
                <strong>Ejecutivo:</strong> {record.assignedTo?.name}
              </Typography>
            </Grid>

            {/* ETAPA ACTUAL */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Etapa Actual</InputLabel>
                <Select
                  value={record.postSaleStage}
                  label="Etapa Actual"
                  onChange={(e) => updateField("postSaleStage", e.target.value)}
                >
                  {STAGES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace(/_/g, " ").toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* MEDICIÓN DE RESULTADOS */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            📊 Medición de Resultados
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Describe KPIs, métricas, desempeño..."
            value={record.medicionResultados || ""}
            onChange={(e) => updateField("medicionResultados", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ENCUESTA DE SATISFACCION */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            😊 Encuesta de satisfacción
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 1.6 }}>
              <TextField
                type="number"
                label="Calificación (1-10)"
                fullWidth
                inputProps={{ min: 1, max: 10 }}
                value={record.encuestaSatisfaccion?.calificacion || ""}
                onChange={(e) =>
                  updateField("encuestaSatisfaccion", {
                    ...record.encuestaSatisfaccion,
                    calificacion: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 10. }}>
              <TextField
                fullWidth
                multiline
                label="Comentarios"
                minRows={3}
                value={record.encuestaSatisfaccion?.comentarios || ""}
                onChange={(e) =>
                  updateField("encuestaSatisfaccion", {
                    ...record.encuestaSatisfaccion,
                    comentarios: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* RENOVACIÓN */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            🔄 Renovación
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 1.9 }}>
              <FormControl fullWidth>
                <InputLabel>¿Requiere renovación?</InputLabel>
                <Select
                  value={record.renovacion?.requiereRenovacion ? "yes" : "no"}
                  label="¿Requiere renovación?"
                  onChange={(e) =>
                    updateField("renovacion", {
                      ...record.renovacion,
                      requiereRenovacion: e.target.value === "yes",
                    })
                  }
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Sí</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha posible renovación"
                InputLabelProps={{ shrink: true }}
                value={
                  record.renovacion?.fechaPosibleRenovacion
                    ? record.renovacion.fechaPosibleRenovacion.slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  updateField("renovacion", {
                    ...record.renovacion,
                    fechaPosibleRenovacion: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* NOTAS */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            📝 Notas
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Notas adicionales del ejecutivo..."
            value={record.notas || ""}
            onChange={(e) => updateField("notas", e.target.value)}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
