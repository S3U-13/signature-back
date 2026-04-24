const db = require("../models");
const { sequelize } = db;
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const templateMap = require("../templates");
const { generateChecksum } = require("../utils/checksum");

exports.generatePdf = async (req, res) => {
  const cookie = req.headers.cookie;
  const { form_id } = req.params;

  try {
    // 1. ดึงข้อมูล form
    // const form = await db.Form.findOne({
    //   where: { id: form_id, form_status: "Success", flag_status: "a" },
    //   include: [
    //     {
    //       model: db.FormType,
    //       as: "FormTypeName",
    //       attributes: ["form_name"],
    //     },
    //   ],
    // });
    const options = await db.Option.findAll({
      attributes: ["id", "option_group_id", "name", "flag_status"],
      include: [
        { model: db.OptionGroup, as: "OptionGroupName", attributes: ["name"] },
      ],
    });
    const form = await fetch(
      `${process.env.API_URL}user/form-by-id/${form_id}`,
      { headers: { Cookie: cookie } },
    ).then((res) => res.json());

    if (!form) {
      return res
        .status(404)
        .json({ message: "Form not found or status form not Success" });
    }

    // 🔥 form มาจาก fetch จึงเป็น plain object (ไม่มี .toJSON())
    const checksum = generateChecksum(form);

    // 1. cache check
    const existing = await db.Pdf.findOne({
      where: {
        form_id,
        checksum,
        status: "active",
      },
    });

    if (existing) {
      return res.json({
        message: "cache hit",
        file_id: existing.id,
        url: `/api/user/get-pdf/${existing.id}`,
      });
    }

    // 2. หา last version
    const last = await db.Pdf.findOne({
      where: { form_id },
      order: [["version", "DESC"]],
    });

    const version = last ? last.version + 1 : 1;

    // 2.1. เลือก template

    const form_type_id = form.data_form.form.form_type_id;

    const templateFn = templateMap[form_type_id];

    if (!templateFn) {
      return res.status(400).json({ message: "No template of this form type" });
    }

    // 3. สร้าง HTML
    const html = templateFn(form, options);

    // 🔥 4. generate PDF → เป็น buffer (ไม่ต้อง save file)
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // 🔥 รอ render ให้ครบ
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // 🔥 generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    // console.log("buffer length:", pdfBuffer.length);
    // console.log(pdfBuffer.slice(0, 10));

    // 🔥 5. save ลง DB (BLOB)
    console.log("📝 Saving PDF to DB:");
    console.log("   - buffer type:", typeof pdfBuffer);
    console.log("   - is Buffer:", Buffer.isBuffer(pdfBuffer));
    console.log("   - buffer length:", pdfBuffer.length);
    console.log(
      "   - first 10 bytes (hex):",
      pdfBuffer.slice(0, 10).toString("hex"),
    );
    console.log(
      "   - first 10 bytes (ascii):",
      pdfBuffer.slice(0, 10).toString("ascii"),
    );

    const file = await db.Pdf.create({
      form_id,
      file_name: `report-v${version}.pdf`,
      file_data: pdfBuffer,
      file_size: pdfBuffer.length,
      checksum,
      version,
      storage_type: "blob",
      created_by: req.user?.userid || null,
    });

    return res.json({
      message: "PDF generated",
      file_id: file.id,
      url: `/api/user/get-pdf/${file.id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPdf = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await db.Pdf.findOne({
      where: {
        id,
        status: "active",
      },
    });

    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    if (!file.file_data) {
      return res.status(404).json({ message: "file data is empty" });
    }

    let buffer;

    // console.log("📊 file_data type:", typeof file.file_data);
    // console.log("📊 is Buffer?:", Buffer.isBuffer(file.file_data));
    // console.log("📊 file_data length:", file.file_data.length);
    // console.log("📊 file_data first 20 bytes:", file.file_data.slice(0, 20));

    // 🔥 Sequelize MySQL BLOB handling - 3 cases
    if (Buffer.isBuffer(file.file_data)) {
      // Case 1: อาจเป็น JSON array เก็บใน Buffer ต้องตรวจสอบ
      const firstBytes = file.file_data.slice(0, 20).toString("ascii");
      // console.log("First 20 bytes as ascii:", firstBytes);

      // ถ้ามี comma = มันคือ decimal array string "37,80,68,70,..."
      if (firstBytes.includes(",")) {
        // console.log("⚠️  Detected decimal array in Buffer, converting...");
        const decimalArray = file.file_data
          .toString("ascii")
          .split(",")
          .map((x) => parseInt(x, 10));
        buffer = Buffer.from(decimalArray);
      } else {
        // PDF จริง ๆ
        buffer = file.file_data;
        console.log("✅ Already a proper PDF Buffer");
      }
    } else if (typeof file.file_data === "string") {
      console.log("⚠️  file_data is string");

      // Case 2: string ของ decimal array "37,80,68,70,..."
      if (file.file_data.includes(",")) {
        console.log("⚠️  Detected decimal array string, converting...");
        const decimalArray = file.file_data
          .split(",")
          .map((x) => parseInt(x, 10));
        buffer = Buffer.from(decimalArray);
      } else {
        // Case 3: binary string (latin1)
        buffer = Buffer.from(file.file_data, "latin1");
      }
    } else {
      return res.status(400).json({ message: "invalid file data format" });
    }

    // console.log("📊 final buffer first 10 bytes:", buffer.slice(0, 10));
    // console.log("📊 final buffer as hex:", buffer.slice(0, 10).toString("hex"));
    // console.log(
    //   "📊 trying to read as ascii:",
    //   buffer.slice(0, 10).toString("ascii"),
    // );

    // 🔥 Validate PDF header
    if (buffer.length < 5 || buffer.slice(0, 4).toString("ascii") !== "%PDF") {
      console.warn(
        "❌ PDF header invalid. Expected %PDF, got:",
        buffer.slice(0, 10).toString("ascii"),
      );
      return res.status(400).json({ message: "invalid PDF file" });
    }

    // console.log("✅ PDF header valid");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Disposition", "inline; filename=file.pdf");
    res.setHeader("Content-Transfer-Encoding", "binary");

    return res.end(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const files = await db.Pdf.findAll({
      where: { status: "active" },
      attributes: ["id", "form_id", "file_name", "file_size", "createdAt"], // ❌ ไม่เอา file_data
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

exports.cancel = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await db.Pdf.findOne({
      where: { id, status: "active" },
    });

    if (!file) return res.sendStatus(404);

    await file.update({ status: "deleted" });

    return res.status(200).json({ message: "deleted" });
  } catch (err) {
    return res.status(500).json({ message: "error" });
  }
};

exports.previewPdf = async (req, res) => {
  const cookie = req.headers.cookie;
  const { form_id } = req.params;

  try {
    // 1. ดึง option
    const optionData = await db.Option.findAll({
      attributes: ["id", "option_group_id", "name", "flag_status"],
      include: [
        { model: db.OptionGroup, as: "OptionGroupName", attributes: ["name"] },
      ],
    });

    // 2. ดึง form
    const form = await fetch(
      `${process.env.API_URL}user/form-by-id/${form_id}`,
      { headers: { Cookie: cookie } },
    ).then((res) => res.json());

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // 3. เลือก template
    const form_type_id = form.data_form.form.form_type_id;
    const templateFn = templateMap[form_type_id];

    if (!templateFn) {
      return res.status(400).json({ message: "No template of this form type" });
    }

    // 4. render HTML
    const html = templateFn(form, optionData);

    // 🔥 DEBUG: ดู HTML ก่อนก็ได้
    // return res.send(html);

    // 5. สร้าง PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    // 6. ส่ง preview กลับ (ไม่ save)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=preview.pdf",
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
