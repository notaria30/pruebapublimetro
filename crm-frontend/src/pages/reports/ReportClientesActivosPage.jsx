import { useEffect, useState } from "react";
import { getActiveClients } from "../../services/reportService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Stack,
} from "@mui/material";

export default function ReportClientesActivosPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getActiveClients();
      setClients(res.data.clientes);
    }
    load();
  }, []);

  return (
    <Box maxWidth="1100px" mx="auto" mt={4} px={3}>
      {/* Título */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Clientes Activos
      </Typography>

      {/* Card contenedor */}
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          {clients.length === 0 ? (
            <Typography color="text.secondary" fontSize={18}>
              No hay clientes activos en este momento.
            </Typography>
          ) : (
            <List>
              {clients.map((c, index) => (
                <Box key={c._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography fontSize={18} fontWeight={600}>
                          {c.nombreComercial}
                        </Typography>
                      }
                    />
                  </ListItem>

                  {index < clients.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* BOTÓN VOLVER */}
      <Stack direction="row" justifyContent="flex-end" mt={3}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.history.back()}
          sx={{ fontWeight: 600 }}
        >
          Volver
        </Button>
      </Stack>
    </Box>
  );
}
