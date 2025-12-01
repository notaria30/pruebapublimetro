import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Switch } from "@mui/material";

export default function QuoteCortesiasSection({ form, setForm }) {
  const handleFechaChange = (index, value) => {
    setForm((prev) => {
      const fechas = [...prev.cortesias.fechas];
      fechas[index] = value;

      return {
        ...prev,
        cortesias: {
          ...prev.cortesias,
          fechas,
        },
      };
    });
  };

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Cortesías
          </Typography>
          <Switch
            checked={form.cortesias.activo}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cortesias: {
                  ...prev.cortesias,
                  activo: e.target.checked,
                },
              }))
            }
          />
        </Box>
        {form.cortesias.activo && (
          <Box mt={2}>
            <Grid container spacing={3}>
              {/* Cantidad */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={form.cortesias.cantidad}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      cortesias: {
                        ...prev.cortesias,
                        cantidad:
                          e.target.value === "" ? "" : Number(e.target.value),
                      },
                    }))
                  }
                />
              </Grid>

              {/* Fechas */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {form.cortesias.fechas.map((fecha, i) => (
                    <Grid item xs={12} md={3} key={i}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha"
                        value={fecha}
                        onChange={(e) => handleFechaChange(i, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
