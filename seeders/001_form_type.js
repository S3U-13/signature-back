const FormType = require("../models/form_type");

const type_name = [
  { form_name: "หนังสืออธิบายและยินยอมให้ทำการจำลองการฉายรังสี" },
  { form_name: "ใบรับทราบข้อมูลเเละยินยอมรับการรักษาด้วยการฉายรังสี" },
  { form_name: "ใบรับทราบข้อมูลเเละยินยอมรับการรักษาด้วยการใส่เเร่" },
];

async function seed() {
  await FormType.bulkCreate(type_name);

  console.log("✅ Seeded form_type");
}

seed();
