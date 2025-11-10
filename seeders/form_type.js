const FormType = require("../models/form_type");

const seedData = [
  "หนังสืออธิบายและยินยอมให้ทำการจำลองการฉายรังสี",
  "ใบรับทราบข้อมูลเเละยินยอมรับการรักษาด้วยการฉายรังสี",
  "ใบรับทราบข้อมูลเเละยินยอมรับการรักษาด้วยการใส่เเร่",
];

async function seed() {
  for (const name of seedData) {
    await FormType.create({ form_name: name });
  }
  console.log("✅ Seeded form_type with auto IDs F0001, F0002 ...");
}

seed();
