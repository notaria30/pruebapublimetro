const mongoose = require("mongoose");

const postSaleSchema = new mongoose.Schema(
  {
    // Relación con venta
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },

    // Relación con cliente
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Ejecutivo asignado
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Estado actual post-venta
    postSaleStage: {
      type: String,
      enum: [
        "prospeccion",
        "acercamiento",
        "presentacion_contacto_indicado",
        "propuesta_comercial",
        "negociacion_cierre",
        "documentacion_contrato",
        "facturacion",
        "pago",
        "servicio_post_venta",
        "reportes",
      ],
      default: "servicio_post_venta",
    },

    // Seguimiento post-venta
    medicionResultados: {
      type: String,
    },

    encuestaSatisfaccion: {
      calificacion: { type: Number, min: 1, max: 10 },
      comentarios: { type: String },
    },

    renovacion: {
      requiereRenovacion: { type: Boolean, default: false },
      fechaPosibleRenovacion: { type: Date },
    },

    notas: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostSale", postSaleSchema);
