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

export default function QuoteIntercambioSection({ form, setForm }) {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Intercambio
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          mb={2}
        >
          <Switch
            checked={form.intercambio.activo}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                intercambio: {
                  ...prev.intercambio,
                  activo: e.target.checked,
                },
              }))
            }
          />
        </Box>

        {form.intercambio.activo && (
          <Box mt={2}>
            <Grid container spacing={3}>

              {/* Porcentaje efectivo */}
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  label="% Efectivo"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={form.intercambio.porcentajeEfectivo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      intercambio: {
                        ...prev.intercambio,
                        porcentajeEfectivo: e.target.value === "" ? "" : Number(e.target.value)
                      },
                    }))
                  }
                />
              </Grid>

              {/* Porcentaje especie */}
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  label="% Especie"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={form.intercambio.porcentajeEspecie}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      intercambio: {
                        ...prev.intercambio,
                        porcentajeEspecie:e.target.value === "" ? "" : Number(e.target.value)
                      },
                    }))
                  }
                />
              </Grid>

              {/* Ofrecemos */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ofrecemos"
                  multiline
                  rows={2}
                  value={form.intercambio.ofrecemos}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      intercambio: {
                        ...prev.intercambio,
                        ofrecemos: e.target.value,
                      },
                    }))
                  }
                />
              </Grid>

              {/* Nos ofrecen */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nos ofrecen"
                  multiline
                  rows={2}
                  value={form.intercambio.nosOfrecen}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      intercambio: {
                        ...prev.intercambio,
                        nosOfrecen: e.target.value,
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
