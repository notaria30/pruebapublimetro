// src/pages/clients/ClientEditPage.jsx
import { useState, useEffect } from "react";
import { getClientById, updateClient } from "../../services/clientService";
import { getUsers } from "../../services/userService";
import { useNavigate, useParams } from "react-router-dom";

function ClientEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombreComercial: "",
    razonSocial: "",
    rfc: "",
    curp: "",

    direccion: {
      calleNumero: "",
      colonia: "",
      ciudad: "",
      estado: "",
      pais: "",
      cp: "",
      telefono: "",
    },

    regimen: "",
    agenciaODirecto: "",
    tipoCliente: "",
    tipoIndustria: "",

    contactos: {
      mercadotecnia: { nombre: "", email: "", celular: "" },
      diseno: { nombre: "", email: "", celular: "" },
      facturacion: { nombre: "", email: "", celular: "" },
    },

    ejecutivoAsignado: "",
    clienteActivo: true,
    status: "prospeccion",

    assignedTo: "",
  });

  // Cargar usuarios
  useEffect(() => {
    async function loadUsers() {
      const res = await getUsers();
      setUsers(res.data);
    }
    loadUsers();
  }, []);

  // Cargar cliente existente
  useEffect(() => {
    async function loadClient() {
      try {
        const res = await getClientById(id);
        setForm(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando cliente:", error);
        alert("No se pudo cargar el cliente");
      }
    }
    loadClient();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDireccion = (e) => {
    setForm({
      ...form,
      direccion: { ...form.direccion, [e.target.name]: e.target.value },
    });
  };

  const handleContacto = (area, e) => {
    setForm({
      ...form,
      contactos: {
        ...form.contactos,
        [area]: {
          ...form.contactos[area],
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient(id, form);
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      alert("Error guardando cambios");
    }
  };

  if (loading) return <p className="muted" style={{ padding: 26 }}>Cargando datos...</p>;

  return (
    <div className="form-page">
      <h1 className="form-title">Editar Cliente</h1>

      <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: 10 }}>
        {/* Sección 1: Datos Generales */}
        <h2 className="section-title">Datos Generales</h2>
        <div className="form-grid">
          <div>
            <label className="label">Nombre Comercial</label>
            <input className="input" name="nombreComercial" value={form.nombreComercial} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Razón Social</label>
            <input className="input" name="razonSocial" value={form.razonSocial} onChange={handleChange} />
          </div>
          <div>
            <label className="label">RFC</label>
            <input className="input" name="rfc" value={form.rfc} onChange={handleChange} />
          </div>
          <div>
            <label className="label">CURP</label>
            <input className="input" name="curp" value={form.curp} onChange={handleChange} />
          </div>
        </div>

        {/* Dirección */}
        <h2 className="section-title">Dirección</h2>
        <div className="form-grid">
          <input className="input" placeholder="Calle y Número" name="calleNumero" value={form.direccion.calleNumero} onChange={handleDireccion} />
          <input className="input" placeholder="Colonia" name="colonia" value={form.direccion.colonia} onChange={handleDireccion} />
          <input className="input" placeholder="Ciudad" name="ciudad" value={form.direccion.ciudad} onChange={handleDireccion} />
          <input className="input" placeholder="Estado" name="estado" value={form.direccion.estado} onChange={handleDireccion} />
          <input className="input" placeholder="País" name="pais" value={form.direccion.pais} onChange={handleDireccion} />
          <input className="input" placeholder="CP" name="cp" value={form.direccion.cp} onChange={handleDireccion} />
          <input className="input" placeholder="Teléfono" name="telefono" value={form.direccion.telefono} onChange={handleDireccion} />
        </div>

        {/* Clasificación */}
        <h2 className="section-title">Clasificación</h2>
        <label className="label">Régimen Fiscal</label>
        <select className="select" name="regimen" value={form.regimen} onChange={handleChange}>
          <option value="">Seleccione...</option>
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
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>

        <label className="label">Agencia o Directo</label>
        <select className="select" name="agenciaODirecto" value={form.agenciaODirecto} onChange={handleChange}>
          <option value="">Seleccione...</option>
          <option value="AGENCIA">AGENCIA</option>
          <option value="DIRECTO">DIRECTO</option>
        </select>

        <label className="label">Tipo Cliente</label>
        <select className="select" name="tipoCliente" value={form.tipoCliente} onChange={handleChange}>
          <option value="">Seleccione...</option>
          <option value="iniciativa privada">Iniciativa privada</option>
          <option value="gobierno">Gobierno</option>
          <option value="corporativo">Corporativo</option>
        </select>

        <label className="label">Industria</label>
        <select className="select" name="tipoIndustria" value={form.tipoIndustria} onChange={handleChange}>
          <option value="">Seleccione...</option>
          <option value="alimentaria">Alimentaria</option>
          <option value="hotelera">Hotelera</option>
          <option value="automotriz">Automotriz</option>
          <option value="construccion">Construcción</option>
          <option value="servicios financieros">Servicios financieros</option>
        </select>

        {/* Contactos */}
        <h2 className="section-title">Contactos</h2>
        <h3 className="label" style={{ fontSize: 14, marginTop: 6 }}>Mercadotecnia</h3>
        <div className="form-grid-3">
          <input className="input" placeholder="Nombre" name="nombre" value={form.contactos.mercadotecnia.nombre} onChange={(e) => handleContacto("mercadotecnia", e)} />
          <input className="input" placeholder="Email" name="email" value={form.contactos.mercadotecnia.email} onChange={(e) => handleContacto("mercadotecnia", e)} />
          <input className="input" placeholder="Celular" name="celular" value={form.contactos.mercadotecnia.celular} onChange={(e) => handleContacto("mercadotecnia", e)} />
        </div>

        <h3 className="label" style={{ fontSize: 14, marginTop: 6 }}>Diseño</h3>
        <div className="form-grid-3">
          <input className="input" placeholder="Nombre" name="nombre" value={form.contactos.diseno.nombre} onChange={(e) => handleContacto("diseno", e)} />
          <input className="input" placeholder="Email" name="email" value={form.contactos.diseno.email} onChange={(e) => handleContacto("diseno", e)} />
          <input className="input" placeholder="Celular" name="celular" value={form.contactos.diseno.celular} onChange={(e) => handleContacto("diseno", e)} />
        </div>

        <h3 className="label" style={{ fontSize: 14, marginTop: 6 }}>Facturación</h3>
        <div className="form-grid-3">
          <input className="input" placeholder="Nombre" name="nombre" value={form.contactos.facturacion.nombre} onChange={(e) => handleContacto("facturacion", e)} />
          <input className="input" placeholder="Email" name="email" value={form.contactos.facturacion.email} onChange={(e) => handleContacto("facturacion", e)} />
          <input className="input" placeholder="Celular" name="celular" value={form.contactos.facturacion.celular} onChange={(e) => handleContacto("facturacion", e)} />
        </div>


        <h2 className="section-title">Asignar a Usuario</h2>
        <select className="select" name="assignedTo" value={form.assignedTo} onChange={handleChange}>
          <option value="">Seleccione usuario...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <div style={{ marginTop: 10 }}>
          <label className="label">Status del Cliente</label>
          <select className="select"
            value={form.status || ""}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="prospeccion">Prospección</option>
            <option value="presentacion">Presentación</option>
            <option value="propuesta">Propuesta</option>
            <option value="cierre">Cierre</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default ClientEditPage;
