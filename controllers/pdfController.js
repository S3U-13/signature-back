const db = require("../models");
const { sequelize } = db;
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

exports.generatePdf = async (req, res) => {
  const { form_id } = req.params;

  try {
    const fileName = `report-${Date.now()}.pdf`;
    const dir = path.join(__dirname, "../uploads/pdf");

    // ✅ สร้าง folder ถ้ายังไม่มี
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, fileName);

    // 🔥 generate PDF จริง
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(`
      <h1>Form ID: ${form_id}</h1>
      <p>นี่คือ PDF จริงจาก backend</p>
    `);

    await page.pdf({
      path: filePath,
      format: "A4",
    });

    await browser.close();

    const fileStat = fs.statSync(filePath);

    const file = await db.Pdf.create({
      form_id: form_id,
      file_name: fileName,
      file_url: `/uploads/pdf/${fileName}`,
      file_size: fileStat.size,
      created_by: req.user?.id || null,
      ref_id: req.body?.ref_id || null,
      ref_type: req.body?.ref_type || null,
    });

    return res.json({
      message: "PDF generated",
      file_id: file.id,
      url: `/pdf/${file.id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPdf = async (req, res) => {
  const { form_id } = req.params;
  try {
    const file = await db.Pdf.findOne({
      where: {
        form_id: form_id,
        status: "active",
      },
    });

    if (!file) return res.sendStatus(404);

    const fullPath = path.join(__dirname, "..", file.file_url);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "file not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    fs.createReadStream(fullPath).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
};

exports.list = async (req, res) => {
  try {
    const files = await db.Pdf.findAll({
      where: {
        status: "active",
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

exports.cancel = async (req, res) => {
  const { form_id } = req.params;
  try {
    const file = await db.Pdf.findOne({
      where: { form_id: form_id, status: "active" },
    });

    if (!file) return res.sendStatus(404);

    await file.update({ status: "deleted" });

    return res.status(200).json({ message: "deleted" });
  } catch (err) {
    return res.status(500).json({ message: "error" });
  }
};
