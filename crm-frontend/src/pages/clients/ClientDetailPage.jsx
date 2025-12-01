import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { getClientById, updateClient, deleteClient } from "../../services/clientService";
import { getUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOwner } = useAuth();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignedToId, setAssignedToId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const readOnlyStyle = !isEditing
    ? {
        cursor: "default",
        "& .MuiInputBase-input": { cursor: "default" },
      }
    : {};

  const loadClient = async () => {
    try {
      const res = await getClientById(id);
      setClient(res.data);
      setAssignedToId(res.data.assignedTo?._id || "");
    } catch (err) {
      console.error("Error cargando cliente", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!isOwner) return;
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  };

  useEffect(() => {
    loadClient();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setClient((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDireccionChange = (field, value) => {
    setClient((prev) => ({
      ...prev,
      direccion: {
        ...(prev.direccion || {}),
        [field]: value,
      },
    }));
  };

  const handleContactoChange = (area, field, value) => {
    setClient((prev) => ({
      ...prev,
      contactos: {
        ...(prev.contactos || {}),
        [area]: {
          ...(prev.contactos?.[area] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    const payload = { ...client };

    if (isOwner && assignedToId) {
      payload.assignedTo = assignedToId;
    }

    try {
      await updateClient(id, payload);
      setSnackbar({
        open: true,
        message: "Cliente actualizado correctamente",
        severity: "success",
      });
      setIsEditing(false);
      await loadClient();
    } catch (err) {
      console.error("Error actualizando cliente", err);
      setSnackbar({
        open: true,
        message: "Error al actualizar el cliente",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Cliente eliminado correctamente",
        severity: "success",
      });
      setTimeout(() => navigate("/clients"), 1000);
    } catch (err) {
      console.error("Error eliminando cliente", err);
      setSnackbar({
        open: true,
        message: "Error al eliminar el cliente",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading || !client) {
    return (
      <Typography sx={{ p: 4 }} variant="body1">
        Cargando...
      </Typography>
    );
  }

  const canEditOwnerOnly = isOwner && isEditing;

  return (
    <Box sx={{ p: 3 }}>
      {/* TITLE */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Detalles del Cliente
      </Typography>

      {/* HEADER BUTTONS */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button variant="outlined" onClick={() => navigate("/clients")}>
          Volver
        </Button>

        <Box display="flex" gap={2}>
          {!isEditing ? (
            <>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              {isOwner && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Eliminar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={async () => {
                  await loadClient();
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="success" onClick={handleSave}>
                Guardar cambios
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ===== DATOS GENERALES ===== */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Datos Generales
        </Typography>

        <Grid container spacing={3}>
          {/* Campos texto editables por cualquiera en modo edición */}
          {[
            ["nombreComercial", "Nombre Comercial"],
            ["razonSocial", "Razón Social"],
            ["rfc", "RFC"],
            ["curp", "CURP"],
          ].map(([field, label]) => (
            <Grid size={{ xs: 12, md: 2.5 }} key={field}>
              <TextField
                fullWidth
                label={label}
                name={field}
                value={client[field] || ""}
                onChange={handleChange}
                InputProps={{
                  readOnly: !isEditing,
                  sx: readOnlyStyle,
                }}
              />
            </Grid>
          ))}

          {/* STATUS - Select cuando edita */}
          <Grid item xs={12} md={3}>
            {isEditing ? (
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={client.status || ""}
                onChange={handleChange}
              >
                {["prospeccion", "presentacion", "propuesta", "cierre"].map(
                  (status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  )
                )}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Status"
                value={client.status || ""}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>

          {/* Clasificación: selects en edición, texto en vista */}
          <Grid item xs={12} md={3}>
            {isEditing ? (
              <TextField
                select
                fullWidth
                label="Tipo de Cliente"
                name="tipoCliente"
                value={client.tipoCliente || ""}
                onChange={handleChange}
              >
                <MenuItem value="iniciativa privada">
                  Iniciativa Privada
                </MenuItem>
                <MenuItem value="gobierno">Gobierno</MenuItem>
                <MenuItem value="corporativo">Corporativo</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Tipo de Cliente"
                value={client.tipoCliente || ""}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            {isEditing ? (
              <TextField
                select
                fullWidth
                label="Industria"
                name="tipoIndustria"
                value={client.tipoIndustria || ""}
                onChange={handleChange}
              >
                <MenuItem value="alimentaria">Alimentaria</MenuItem>
                <MenuItem value="hotelera">Hotelera</MenuItem>
                <MenuItem value="automotriz">Automotriz</MenuItem>
                <MenuItem value="construccion">Construcción</MenuItem>
                <MenuItem value="servicios financieros">
                  Servicios Financieros
                </MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Industria"
                value={client.tipoIndustria || ""}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4.5 }}>
            {isEditing ? (
              <TextField
                select
                fullWidth
                label="Régimen"
                name="regimen"
                value={client.regimen || ""}
                onChange={handleChange}
              >
                {[
                  "REGIMEN GENERAL DE LEY PERSONAS MORALES",
                  "RÉGIMEN SIMPLIFICADO DE LEY PERSONAS MORALES",
                  "PERSONAS MORALES CON FINES NO LUCRATIVOS",
                  "RÉGIMEN DE PEQUEÑOS CONTRIBUYENTES",
                  "RÉGIMEN DE SUELDOS Y SALARIOS E INGRESOS ASIMILADOS A SALARIOS",
                  "RÉGIMEN DE ARRENDAMIENTO",
                  "RÉGIMEN SIMPLIFICADO DE LEY PERSONAS FÍSICAS",
                  "RÉGIMEN DE INCORPORACIÓN FISCAL",
                ].map((reg) => (
                  <MenuItem key={reg} value={reg}>
                    {reg}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Régimen"
                value={client.regimen || ""}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            {isEditing ? (
              <TextField
                select
                fullWidth
                label="Agencia / Directo"
                name="agenciaODirecto"
                value={client.agenciaODirecto || ""}
                onChange={handleChange}
              >
                <MenuItem value="AGENCIA">AGENCIA</MenuItem>
                <MenuItem value="DIRECTO">DIRECTO</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Agencia / Directo"
                value={client.agenciaODirecto || ""}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>
        </Grid>
      </Card>

      {/* ===== DIRECCIÓN ===== */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Dirección
        </Typography>

        <Grid container spacing={3}>
          {[
            ["calleNumero", "Calle y número"],
            ["colonia", "Colonia"],
            ["ciudad", "Ciudad"],
            ["estado", "Estado"],
            ["pais", "País"],
            ["cp", "C.P."],
            ["telefono", "Teléfono"],
          ].map(([field, label]) => (
            <Grid item xs={12} md={4} key={field}>
              <TextField
                fullWidth
                label={label}
                value={client.direccion?.[field] || ""}
                onChange={(e) => handleDireccionChange(field, e.target.value)}
                InputProps={{
                  readOnly: !isEditing,
                  sx: readOnlyStyle,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* ===== CONTACTOS ===== */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Contactos
        </Typography>

        <Grid container spacing={3}>
          {["mercadotecnia", "diseno", "facturacion"].map((area) => (
            <Grid item xs={12} md={4} key={area}>
              <Typography fontWeight={600} mb={1}>
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </Typography>

              {["nombre", "email", "celular"].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={client.contactos?.[area]?.[field] || ""}
                  onChange={(e) =>
                    handleContactoChange(area, field, e.target.value)
                  }
                  InputProps={{
                    readOnly: !isEditing,
                    sx: readOnlyStyle,
                  }}
                  sx={{ mb: 2 }}
                />
              ))}
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* ===== ASIGNACIÓN ===== */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Asignación
        </Typography>

        <Grid container spacing={3}>
          {/* Asignado a usuario (solo admin puede cambiar) */}
          <Grid item xs={12} md={4}>
            {canEditOwnerOnly ? (
              <TextField
                select
                fullWidth
                label="Ejecutivo Asignado"
                name="assignedTo"
                value={assignedToId || ""}
                onChange={(e) => setAssignedToId(e.target.value)}
              >
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Ejecutivo Asignado"
                value={client.assignedTo?.name || "N/A"}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>

          {/* Cliente activo (worker + admin pueden cambiar en edición) */}
          <Grid item xs={12} md={4}>
            {isEditing ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={client.clienteActivo}
                    onChange={(e) =>
                      setClient((prev) => ({
                        ...prev,
                        clienteActivo: e.target.checked,
                      }))
                    }
                  />
                }
                label={client.clienteActivo ? "Activo" : "Inactivo"}
              />
            ) : (
              <TextField
                fullWidth
                label="Cliente activo"
                value={client.clienteActivo ? "Sí" : "No"}
                InputProps={{
                  readOnly: true,
                  sx: readOnlyStyle,
                }}
              />
            )}
          </Grid>
        </Grid>
      </Card>

      {/* ===== HISTORIAL ===== */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Historial
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Creado el"
              value={
                client.createdAt
                  ? new Date(client.createdAt).toLocaleString()
                  : ""
              }
              InputProps={{
                readOnly: true,
                sx: readOnlyStyle,
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Actualizado el"
              value={
                client.updatedAt
                  ? new Date(client.updatedAt).toLocaleString()
                  : ""
              }
              InputProps={{
                readOnly: true,
                sx: readOnlyStyle,
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* DIALOG ELIMINAR */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: 700, pb: 1 }}>
          Eliminar cliente
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Typography sx={{ fontSize: "1rem", color: "grey.700" }}>
            ¿Seguro que quieres eliminar este cliente?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR ÚNICO */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}