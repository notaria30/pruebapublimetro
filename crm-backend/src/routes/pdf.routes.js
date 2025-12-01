const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Quote = require("../models/Quote");
const path = require("path");

router.get("/quote/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate("client");
    if (!quote) return res.status(404).send("Cotización no encontrada");

    // Crear PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=cotizacion-${quote.folio}.pdf`
    );

    doc.pipe(res);

    // ===========================
    // HEADER CON LOGO
    // ===========================
    const logoPath = path.join(__dirname, "../../public/logopublimetro.png");

    doc.image(logoPath, 50, 20, { width: 140 });

    doc
      .fontSize(10)
      .fillColor("#555")
      .text(
        "Av. de la Salvación 791-despacho 103, Balcones Coloniales,\n76147 Santiago de Querétaro, Qro., México",
        380,
        30,
        { align: "right" }
      );

    doc.moveDown(4);

    // TÍTULO
    doc
      .fontSize(22)
      .fillColor("#0A6A44")
      .text(`Cotización #${quote.folio}`, { align: "left" });

    doc
      .moveDown()
      .fontSize(12)
      .fillColor("black")
      .text(`Fecha de emisión: ${new Date().toLocaleDateString("es-MX")}`)
      .text(`Vigencia: 15 días naturales a partir de la fecha de emisión.`);

    doc.moveDown();

    // ===========================
    // INFORMACIÓN DEL CLIENTE
    // ===========================
    const boxTop = doc.y;

    doc
      .rect(50, boxTop, 500, 70)
      .strokeColor("#0A6A44")
      .lineWidth(2)
      .stroke();

    doc
      .fontSize(14)
      .fillColor("#0A6A44")
      .text("Información del Cliente", 60, boxTop + 10);

    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Cliente: ${quote.client?.nombreComercial || "N/A"}`, 60, boxTop + 30)
      .text(`Status: ${quote.status}`, 60, boxTop + 45)
      .text(`Total: $${quote.total}`, 60, boxTop + 60);

    doc.moveDown(5);

    // ===========================
    // TABLA DE TARIFAS
    // ===========================
    doc.fontSize(16).fillColor("#0A6A44").text("Tarifas", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;

    const headers = ["Formato", "Periodicidad", "Costo", "Fechas", "Total Línea"];
    const colWidths = [100, 100, 80, 160, 100];

    doc.fontSize(12).fillColor("white");
    doc.rect(50, tableTop, 500, 22).fill("#0A6A44");

    let x = 55;
    headers.forEach((h, i) => {
      doc.text(h, x, tableTop + 6);
      x += colWidths[i];
    });

    doc.fillColor("black");

    let y = tableTop + 25;

    const tarifas = quote.tarifas || [];

    tarifas.forEach((t) => {
      const fechas = (t.fechas || [])
        .map((f) => new Date(f).toLocaleDateString("es-MX"))
        .join(", ");

      const row = [
        t.formato,
        t.periodicidad,
        `$${t.costo}`,
        fechas,
        `$${t.totalLinea}`,
      ];

      let xRow = 55;

      row.forEach((cell, i) => {
        doc.text(cell, xRow, y, { width: colWidths[i] - 10 });
        xRow += colWidths[i];
      });

      y += 20;

      doc
        .moveTo(50, y)
        .lineTo(550, y)
        .strokeColor("#ccc")
        .stroke();
    });

    doc.moveDown(3);

    // ===========================
    // PIE DE PÁGINA
    // ===========================
    const bottom = doc.page.height - 80;

    doc
      .fontSize(10)
      .fillColor("#888")
      .text(
        "Esta cotización es confidencial y para uso exclusivo del cliente destinatario.\n" +
          "Los precios están sujetos a cambios sin previo aviso.",
        50,
        bottom,
        { align: "center", width: 500 }
      );

    doc.end();
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).send("Error generando PDF");
  }
});

module.exports = router;
