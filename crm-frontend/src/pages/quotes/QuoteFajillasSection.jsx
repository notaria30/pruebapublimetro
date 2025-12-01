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

export default function QuoteFajillasSection({ form, setForm }) {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
<Typography variant="h6" fontWeight={700} mb={2}>
  Fajillas
</Typography>

<Box 
  display="flex" 
  alignItems="center" 
  justifyContent="flex-end" 
  width="100%" 
  mb={2}
>
  <Switch
    checked={form.fajillas.activo}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        fajillas: {
          ...prev.fajillas,
          activo: e.target.checked,
        },
      }))
    }
  />
</Box>

        {/* Si está activo, mostrar campos */}
        {form.fajillas.activo && (
          <Box mt={2}>
            <Grid container spacing={3}>

              {/* Cantidad */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={form.fajillas.cantidad}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fajillas: {
                        ...prev.fajillas,
                        cantidad:
                          e.target.value === "" ? "" : Number(e.target.value),
                      },
                    }))
                  }
                />
              </Grid>

              {/* Precio */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Precio"
                  type="number"
                  value={form.fajillas.precio}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fajillas: {
                        ...prev.fajillas,
                        precio:
                          e.target.value === "" ? "" : Number(e.target.value),
                      },
                    }))
                  }
                />
              </Grid>

              {/* Puntos de distribución */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Puntos de distribución"
                  multiline
                  rows={3}
                  value={form.fajillas.puntosDistribucion}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fajillas: {
                        ...prev.fajillas,
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
