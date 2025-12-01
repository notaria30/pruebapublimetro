const express = require("express");
const Sale = require("../models/Sale");
const Client = require("../models/Client");
const Quote = require("../models/Quote");
const Invoice = require("../models/Invoice");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

// Dashboard Overview (tarjetas principales)
router.get("/overview", auth, async (req, res) => {
  try {
    let clienteFiltro = {};
    let ventaFiltro = {};
    let facturaFiltro = {};
    let quoteFiltro = {};

    if (req.user.role === "WORKER") {
      clienteFiltro.assignedTo = req.user._id;
      ventaFiltro.assignedTo = req.user._id;
      facturaFiltro.createdBy = req.user._id;
      quoteFiltro.createdBy = req.user._id;
    }

    const totalClientes = await Client.countDocuments(clienteFiltro);

    const ventasCerradas = await Sale.countDocuments({
      ...ventaFiltro,
      pipelineStage: "cierre",
    });

    const facturasPagadas = await Invoice.aggregate([
      { $match: { pagado: true, ...facturaFiltro } },
      { $group: { _id: null, total: { $sum: "$importeConIVA" } } },
    ]);

    const facturasPendientes = await Invoice.aggregate([
      { $match: { pagado: false, ...facturaFiltro } },
      { $group: { _id: null, total: { $sum: "$importeConIVA" } } },
    ]);

    const totalCotizaciones = await Quote.countDocuments(quoteFiltro);

    res.json({
      totalClientes,
      ventasCerradas,
      totalFacturado: facturasPagadas[0]?.total || 0,
      totalPendiente: facturasPendientes[0]?.total || 0,
      totalCotizaciones,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
});


// Pipeline de ventas (conteo por etapa)
router.get("/pipeline", auth, async (req, res) => {
  try {
    const etapas = ["prospeccion", "presentacion", "propuesta", "cierre"];
    const pipelineData = {};

    for (const etapa of etapas) {
      const filtro = { pipelineStage: etapa };

      if (req.user.role === "WORKER") {
        filtro.assignedTo = req.user._id;
      }

      pipelineData[etapa] = await Sale.countDocuments(filtro);
    }

    res.json(pipelineData);
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
});


// Facturación (pagado vs pendiente)
router.get("/billing", auth, async (req, res) => {
  try {
    const filtro = {};

    if (req.user.role === "WORKER") {
      filtro.createdBy = req.user._id;
    }

    const pagado = await Invoice.aggregate([
      { $match: { pagado: true, ...filtro } },
      { $group: { _id: null, total: { $sum: "$importeConIVA" } } },
    ]);

    const pendiente = await Invoice.aggregate([
      { $match: { pagado: false, ...filtro } },
      { $group: { _id: null, total: { $sum: "$importeConIVA" } } },
    ]);

    res.json({
      pagado: pagado[0]?.total || 0,
      pendiente: pendiente[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
});


// Clientes activos y nuevos del mes
router.get("/clients", auth, async (req, res) => {
  try {
    let filtrosActivos = { clienteActivo: true };
    let filtrosNuevosMes = {};

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    filtrosNuevosMes.createdAt = { $gte: inicioMes };

    if (req.user.role === "WORKER") {
      filtrosActivos.assignedTo = req.user._id;
      filtrosNuevosMes.assignedTo = req.user._id;
    }

    const activos = await Client.countDocuments(filtrosActivos);
    const nuevosMes = await Client.countDocuments(filtrosNuevosMes);

    res.json({
      activos,
      nuevosMes,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
});


// Cotizaciones del mes
router.get("/quotes", auth, async (req, res) => {
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    let filtros = { createdAt: { $gte: inicioMes } };

    if (req.user.role === "WORKER") {
      filtros.createdBy = req.user._id;
    }

    const cotizacionesMes = await Quote.countDocuments(filtros);

    res.json({ cotizacionesMes });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
});


module.exports = router;
