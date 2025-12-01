import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function QuoteEstadoAprobacionSection({
  form,
  setForm,
  mode,
  initialQuote,
  approveQuote,
  rejectQuote,
  user,
}) {
  const userIsDirector =
    user?.role === "OWNER" || user?.role === "DIRECTOR";

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>

        <Typography variant="h6" fontWeight={700} mb={2}>
          Estado y aprobación
        </Typography>

        <Grid container spacing={3}>
          {/* Estado de aprobación (solo lectura) */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado de aprobación"
              value={form.status}
              disabled
              helperText="* Solo las cotizaciones aprobadas pueden convertirse en venta."
            />
          </Grid>
        </Grid>

        {/* BOTONES SOLO PARA OWNER o DIRECTOR Y SOLO EN MODO EDICIÓN */}
        {mode === "edit" && userIsDirector && initialQuote && (
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              color="success"
              onClick={async () => {
                await approveQuote(initialQuote._id);
                alert("Cotización aprobada");
                window.location.reload();
              }}
            >
              ✔ Aprobar
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                await rejectQuote(initialQuote._id);
                alert("Cotización rechazada");
                window.location.reload();
              }}
            >
              ✖ Rechazar
            </Button>
          </Stack>
        )}

      </CardContent>
    </Card>
  );
}
