// src/pages/campaigns/CampaignListPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { getCampaigns } from "../../services/campaignService";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getCampaigns();
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Campañas
        </Typography>

        <Button
          variant="contained"
          component={RouterLink}
          to="/campaigns/new"
        >
          Crear campaña
        </Button>
      </Stack>

      {campaigns.length === 0 ? (
        <Typography color="text.secondary">
          No hay campañas registradas todavía.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((c) => (
            <Grid item xs={12} md={6} key={c._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {c.nombre}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Cliente: {c.client?.nombreComercial || "—"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Rango:{" "}
                    {c.fechaInicio
                      ? new Date(c.fechaInicio).toLocaleDateString("es-MX")
                      : "—"}{" "}
                    -{" "}
                    {c.fechaFin
                      ? new Date(c.fechaFin).toLocaleDateString("es-MX")
                      : "—"}
                  </Typography>

                  <Chip
                    label={c.status}
                    sx={{ mt: 2, textTransform: "capitalize" }}
                    color={
                      c.status === "en_curso"
                        ? "info"
                        : c.status === "finalizada"
                        ? "success"
                        : c.status === "cancelada"
                        ? "error"
                        : "default"
                    }
                  />

                  <Box mt={2}>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/campaigns/${c._id}`}
                    >
                      Ver detalles
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
