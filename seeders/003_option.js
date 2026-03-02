const Option = require("../models/option");

async function seed() {
  await Option.bulkCreate([
    { option_group_id: "1", name: "มี" },
    { option_group_id: "1", name: "ไม่มี" },
    { option_group_id: "2", name: "เคย" },
    { option_group_id: "2", name: "ไม่เคย" },
    { option_group_id: "2", name: "จำไม่ได้" },
    { option_group_id: "3", name: "มี" },
    { option_group_id: "3", name: "ไม่มี" },
    { option_group_id: "3", name: "จำไม่ได้" },
    { option_group_id: "4", name: "ยินยอมให้ตรวจ" },
    { option_group_id: "4", name: "ไม่ยินยอมให้ทำการตรวจ" },
    {
      option_group_id: "5",
      name: "ตัดสินใจเข้ารับการรักษาดังกล่าว เเละ จะไม่ฟ้องร้อง เรียกร้อง หรือ เอาความผิดกับโรงพยาบาล รวมทั้งเเพทย์เเละเจ้าหน้าที่ผู้เกี่ยวข้อง ในผลอันไม่พึงประสงค์ที่อาจเกิดขึ้นกับการรักษาดังกล่าว",
    },
    { option_group_id: "5", name: "ปฏิเสธการรักษา" },
    {
      option_group_id: "6",
      name: "ไม่มีพยานฝ่ายผู้ป่วย (ผู้ป่วยมาคนเดียว)",
    },
    {
      option_group_id: "7",
      name: "โรคภูมิเเพ้",
    },
    {
      option_group_id: "7",
      name: "โรคเบาหวาน",
    },
    {
      option_group_id: "7",
      name: "โรคหอบหืด",
    },
    {
      option_group_id: "7",
      name: "โรคหัวใจ",
    },
    {
      option_group_id: "7",
      name: "โรคไตวาย",
    },
    {
      option_group_id: "7",
      name: "โรคลมชัก",
    },
    {
      option_group_id: "8",
      name: "ข้าพเจ้าเเละผู้เทนของข้าพเจ้าเข้าใจถึงข้อมูลอันเป็นประโยชน์ดังกล่าวเเละซักถามข้อมูลอันเป็นประโยชน์ต่อการตัดสินใจได้ครบถ่วนเเล้วจึงตัดสินในเข้ารับการรักษาดังกล่าว เเละ จะไม่ฟ้องร้องเรียกร้องหรือเอาความผิดกับโรงพยาบาลรวมทั้งเเพทย์เเละเจ้าหน้าที่ผู้เกี่ยวข้องในผลอันไม่พึงประสงค์ที่อาจเกิดขึ้นจากการรักษาดังกล่าว",
    },
  ]);
  console.log("✅ Seeded option");
}

seed();
