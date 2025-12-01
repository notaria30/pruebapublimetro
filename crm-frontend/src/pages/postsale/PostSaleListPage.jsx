// src/pages/postsale/PostSaleListPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPostSales } from "../../services/postSaleService";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from "@mui/material";

export default function PostSaleListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getPostSales();
      setList(res.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        Cargando post-venta...
      </Typography>
    );

  return (
    <Box maxWidth="1300px" mx="auto" mt={4} px={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={700} mb={3}>
          Post-Venta
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/postsale/create"
          sx={{ fontWeight: 600 }}
        >
          Nueva Post-Venta
        </Button>
      </Stack>

      {list.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={5} opacity={0.6}>
          No hay registros post-venta
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {list.map((item) => (
            <Grid item xs={12} md={6} key={item._id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  padding: 2,
                  minHeight: "200px",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    {item.client?.nombreComercial}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Ejecutivo:</strong> {item.assignedTo?.name}
                  </Typography>

                  <Typography>
                    <strong>Actualizado:</strong>{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </Typography>

                  <Chip
                    label={item.postSaleStage.replace(/_/g, " ")}
                    color="primary"
                    sx={{
                      mt: 2,
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  />

                  <Box mt={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      to={`/postsale/${item._id}`}
                      sx={{ fontWeight: 600 }}
                    >
                      Ver Detalles
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
