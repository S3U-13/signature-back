const fs = require("fs");
const path = require("path");

async function seedAll() {
  // สมมติว่าไฟล์อยู่โฟลเดอร์ seeders
  const seedersDir = __dirname;

  // อ่านไฟล์ทั้งหมดในโฟลเดอร์ seeders และ filter .js
  const files = fs
    .readdirSync(seedersDir)
    .filter((file) => file.endsWith(".js") && file !== "seedAll.js")
    .sort(); // <--- เรียงตามชื่อไฟล์

  for (const file of files) {
    const filePath = path.join(seedersDir, file);
    const seeder = require(filePath);

    if (typeof seeder.seed === "function") {
      console.log(`🟢 Running seeder: ${file}`);
      await seeder.seed();
    } else {
      console.log(`⚠️ Skipping ${file}: no seed function`);
    }
  }

  console.log("✅ All seeders executed");
}

seedAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
