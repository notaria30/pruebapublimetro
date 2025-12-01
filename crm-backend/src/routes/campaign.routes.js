// src/routes/campaign.routes.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");

const Campaign = require("../models/Campaign");
const Sale = require("../models/Sale");
const Client = require("../models/Client");
const Quote = require("../models/Quote");

// Crear campaña
router.post("/", auth, async (req, res) => {
  try {
    const data = req.body;

    if (!data.client) {
      return res.status(400).json({ message: "client es requerido" });
    }
    if (!data.nombre) {
      return res.status(400).json({ message: "nombre es requerido" });
    }

    // asegurar createdBy desde el usuario logueado
    data.createdBy = req.user._id;

    const campaign = await Campaign.create(data);

    res.status(201).json(campaign);

  } catch (err) {
    console.error("Error al crear campaña:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Listar campañas
router.get("/", auth, async (req, res) => {
  try {
    let filter = {};

    // Si es WORKER, solo sus campañas (por createdBy)
    if (req.user.role === "WORKER") {
      filter.createdBy = req.user._id;
    }

    const campaigns = await Campaign.find(filter)
      .populate("client", "nombreComercial status")
      .populate("sale", "_id pipelineStage")
      .populate("quote", "folio total")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (err) {
    console.error("Error al listar campañas:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener una campaña por ID
router.get("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("client", "nombreComercial status")
      .populate("sale", "_id pipelineStage")
      .populate("quote", "folio total")
      .populate("createdBy", "name email");

    if (!campaign) {
      return res.status(404).json({ message: "Campaña no encontrada" });
    }

    // Si es WORKER solo puede ver las suyas
    if (
      req.user.role === "WORKER" &&
      campaign.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver esta campaña" });
    }

    res.json(campaign);
  } catch (err) {
    console.error("Error al obtener campaña:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Actualizar campaña
router.put("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaña no encontrada" });
    }

    if (
      req.user.role === "WORKER" &&
      campaign.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar esta campaña" });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("client", "nombreComercial status")
      .populate("sale", "_id pipelineStage")
      .populate("quote", "folio total")
      .populate("createdBy", "name email");

    res.json({
      message: "Campaña actualizada correctamente",
      campaign: updatedCampaign,
    });
  } catch (err) {
    console.error("Error al actualizar campaña:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar campaña
router.delete("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaña no encontrada" });
    }

    if (req.user.role !== "OWNER") {
      return res
        .status(403)
        .json({ message: "Solo el dueño puede eliminar campañas" });
    }

    await campaign.deleteOne();

    res.json({ message: "Campaña eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar campaña:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
