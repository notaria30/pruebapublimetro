import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";

export default function QuoteActivacionSection({ form, setForm }) {
  const addFecha = () => {
    setForm(prev => {
      const fechas = [...prev.activacion.fechas];
      if (fechas.length < 2) fechas.push("");
      return {
        ...prev,
        activacion: { ...prev.activacion, fechas },
      };
    });
  };

  const handleDateChange = (index, value) => {
    setForm(prev => {
      const fechas = [...prev.activacion.fechas];
      fechas[index] = value;
      return {
        ...prev,
        activacion: { ...prev.activacion, fechas },
      };
    });
  };

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Activación
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Switch
            checked={form.activacion.activo}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                activacion: {
                  ...prev.activacion,
                  activo: e.target.checked,
                },
              }))
            }
          />
        </Box>
        {form.activacion.activo && (
          <Box mt={3}>
            <Grid container spacing={3} alignItems="center">

              {/* CANTIDAD */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={form.activacion.cantidad}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      activacion: {
                        ...prev.activacion,
                        cantidad: e.target.value === "" ? "" : Number(e.target.value),
                      },
                    }))
                  }
                />
              </Grid>

              {/* COSTO */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Costo"
                  type="number"
                  value={form.activacion.costo}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      activacion: {
                        ...prev.activacion,
                        costo: e.target.value === "" ? "" : Number(e.target.value),
                      },
                    }))
                  }
                />
              </Grid>

              {/* TIPO */}
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    label="Tipo"
                    value={form.activacion.tipo}
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        activacion: { ...prev.activacion, tipo: e.target.value },
                      }))
                    }
                  >
                    <MenuItem value="Entrega simultanea">Entrega simultánea</MenuItem>
                    <MenuItem value="Encarte">Encarte</MenuItem>
                    <MenuItem value="Walking banner">Walking banner</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* FECHAS */}
              <Grid item xs={12} md={3}>
                <Grid container spacing={2}>
                  {form.activacion.fechas.map((fecha, i) => (
                    <Grid item xs={12} key={i}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha"
                        value={fecha}
                        onChange={(e) => handleDateChange(i, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  ))}
                </Grid>
                {form.activacion.fechas.length < 2 && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    startIcon={<AddIcon />}
                    onClick={addFecha}
                  >
                    Agregar fecha
                  </Button>
                )}
              </Grid>

              {/* PUNTOS DISTRIBUCIÓN */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Puntos de distribución"
                  multiline
                  rows={4}
                  value={form.activacion.puntosDistribucion}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      activacion: {
                        ...prev.activacion,
                        puntosDistribucion: e.target.value,
                      },
                    }))
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
