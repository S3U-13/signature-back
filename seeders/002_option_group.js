const OptionGroup = require("../models/option_group");

async function seed() {
  await OptionGroup.bulkCreate([
    { name: "ตัวเลือก มี , ไม่มี" },
    { name: "ตัวเลือก เคย , ไม่เคย , จำไม่ได้" },
    { name: "ตัวเลือก มี , ไม่มี , จำไม่ได้" },
    { name: "คำถามหมวดยินยอมโดยการใช้รังสีเอกซเรย์เเละสารทึบรังสี" },
    { name: "คำถามหมวดยินยอมรักษาด้วยการฉายรังสี" },
    { name: "คำถามหมวดไม่มีพยานฝ่ายผู้ป่วย" },
    { name: "โรคประจำตัว" },
    { name: "คำถามหมวดยินยอมรักษาด้วยการใส่เเร่" },
  ]);
  console.log("✅ Seeded option group");
}

seed();
