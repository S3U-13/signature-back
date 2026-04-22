const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(
    `
    <h1>Hello PDF</h1>
    <p>จาก backend</p>
  `,
  );

  const filePath = `uploads/pdf/test.pdf`;

  await page.pdf({
    path: filePath,
    format: "A4",
  });

  await browser.close();

  return filePath;
}
