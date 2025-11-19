const Choice = require("../models/choice");

async function seed() {
  await Choice.bulkCreate([
    { choice_type_id: "1", choice_name: "มี" },
    { choice_type_id: "1", choice_name: "ไม่มี" },
    { choice_type_id: "2", choice_name: "เคย" },
    { choice_type_id: "2", choice_name: "ไม่เคย" },
    { choice_type_id: "2", choice_name: "จำไม่ได้" },
    { choice_type_id: "3", choice_name: "มี" },
    { choice_type_id: "3", choice_name: "ไม่มี" },
    { choice_type_id: "3", choice_name: "จำไม่ได้" },
    { choice_type_id: "4", choice_name: "ยินยอมให้ตรวจ" },
    { choice_type_id: "4", choice_name: "ไม่ยินยอมให้ทำการตรวจ" },
    {
      choice_type_id: "4",
      choice_name:
        "ตัดสินใจเข้ารับการรักษาดังกล่าว เเละ จะไม่ฟ้องร้อง เรียกร้อง หรือ เอาความผิดกับโรงพยาบาล รวมทั้งเเพทย์เเละเจ้าหน้าที่ผู้เกี่ยวข้อง ในผลอันไม่พึงประสงค์ที่อาจเกิดขึ้นกับการรักษาดังกล่าว",
    },
    { choice_type_id: "4", choice_name: "ปฏิเสธการรักษา" },
    {
      choice_type_id: "5",
      choice_name: "ไม่มีพยานฝ่ายผู้ป่วย (ผู้ป่วยมาคนเดียว)",
    },
  ]);
  console.log("✅ Seeded choice type");
}

seed();
