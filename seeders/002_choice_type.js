const ChoiceType = require("../models/choice_type");

async function seed() {
  await ChoiceType.bulkCreate([
    { type_name: "คำถามหมวดโรค" },
    { type_name: "คำถามหมวดเคย" },
    { type_name: "คำถามหมวดการเเพ้" },
    { type_name: "คำถามหมวดยินยอม" },
    { type_name: "คำถามหมวดผู้ป่วยมาคนเดียว" },
  ]);
  console.log("✅ Seeded choice type");
}

seed();
