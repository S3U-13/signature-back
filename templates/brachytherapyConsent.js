module.exports = (data) => {
  // set data form
  const form_type = data?.data_form?.form?.FormTypeName?.form_name ?? null;
  const pat_name = data.data_pat.pat
    ? `${data.data_pat.pat.prename}${data.data_pat.pat.firstname} ${data.data_pat.pat.lastname}`
    : null;
  const relation = data?.data_form?.patient_contact?.relation_name ?? null;
  const patient_contact_name = data?.data_form?.patient_contact?.name ?? null;
  const disease = data?.data_form?.form?.disease ?? null;
  const consent_id = data?.data_form?.form?.consent ?? null;
  const consent_name = data?.data_form?.form?.ConsentName?.name ?? null;

  //signature
  const patient_sign = data?.data_form?.patientsign?.patient_sign ?? null;
  const witness_sign = data?.data_form?.witnesssign?.witness_sign ?? null;
  const staff_sign = data?.data_form?.staffsign?.staff_sign ?? null;
  const nurse_sign = data?.data_form?.nursesign?.nurse_sign ?? null;
  const doctor_sign = data?.data_form?.doctorsign?.doctor_sign ?? null;

  //doctor nurse staff name
  const staff_name = data?.data_form?.staff_user?.person_name ?? null;
  const nurse_name = data?.data_form?.nurse_user?.person_name ?? null;
  const doctor_name = data?.data_form?.doctor_user?.person_name ?? null;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body>
      <div class="space-y-2">
      <p class="text-sm font-semibold text-center">${form_type}โรงพยาบาลพระปกเกล้า</p>
      <p class="text-sm text-right">วันที่................................</p>
      <section class="text-sm space-y-2">
        <div class="flex">
          <div class="flex">
            <p>ข้าพเจ้า ชื่อ </p>
            <p class="px-1 border-b border-dotted w-60">${patient_contact_name}</p>
          </div>
          <div class="flex">
            <p>มีความสัมพันธ์เป็น</p>
            <p class="px-1 border-b border-dotted w-40">${relation}</p>
            <p>เกี่ยวข้องกับผู้ป่วย</p>
          </div>
        </div>
        <div class="flex">
          <div class="flex">
            <p>ชื่อ</p>
            <p class="px-1 border-b border-dotted w-40">${pat_name}</p>
          </div>
          <div class="flex">
            <p>เจ็บป่วยด้วยโรคมะเร็ง ปากมดลูก/มดลูก/</p>
            <p class="px-1 border-b border-dotted">${disease}</p>
          </div>
          <p>จะต้องเข้ารับการรักษาด้วยการใส่เเร่</p>
        </div>
      </section>
      
      <section class="mt-2 text-sm space-y-2">
        <p class="indent-8">
          ข้าพเจ้าเเละผู้เเทนของข้าพเจ้า
          เข้าใจถึงวิธีการรักษาด้วยรังสี คือ
          การใส่อุปกรณ์เข้าทางช่องคลอด
          เพื่อใส่เเร่รังสีเข้าทางอุปกรณ์สู่ภายในร่างกายผู้ป่วยในท่านอนโดยใช้เวลาในการรักษาทั้งสิ้นประมาณ
          3 ชั่วโมง
        </p>
        <p class="indent-8">
          ประโยชน์ที่คาดว่าจะได้รับจากการรักษาด้วยรังสี
          คือเพิ่มโอกาสหายขาดจากโรคมะเร็งดังกล่าว
        </p>
        <p class="indent-8">
          ภาวะเเทรกซ้อนที่อาจเกิดจากการรักษาด้วยรังสี
          ทั้งที่อาจเกิดระหว่างการฉายรังสีได้เเก่
          เลือดออกทางช่องคลอด เบื่ออาหาร ปวดท้อง ปัสสาวะเเสบขัด
          มีภาวะติดเชื้อในกระเพาะปัสสาวะ อุจจาระปนเลือด
          ถ่ายเหลวท้องเสียเป็นต้น
        </p>
        <p class="indent-8 mt-12">
          ข้าพเจ้าเเละผู้เทนของข้าพเจ้าเข้าใจถึงข้อมูลอันเป็นประโยชน์ดังกล่าว
          เเละซักถามข้อมูลอันเป็นประโยชน์ต่อการตัดสินใจได้ครบถ่วนเเล้ว
          จึงตัดสินในเข้ารับการรักษาดังกล่าว เเละ จะไม่ฟ้องร้อง
          เรียกร้องหรือเอาความผิดกับโรงพยาบาล
          รวมทั้งเเพทย์เเละเจ้าหน้าที่ผู้เกี่ยวข้อง
          ในผลอันไม่พึงประสงค์ที่อาจเกิดขึ้นจากการรักษาดังกล่าว
        </p>
      </section>
     
      <p>ผู้ให้ข้อมูล </p> <img src="${doctor_sign}"/>
      <p>(${doctor_name})</p>
      <p>ตำเเหน่งเเพทย์</p>
      <p>ผู้ให้คำยินยอม </p> <img src="${patient_sign}"/>
      <p>(${pat_name})</p>
      <p>ผู้ป่วย หรือ ผู้เเทนโดยชอบด้วยกฏหมาย</p>
      <p>พยานฝ่ายผู้ป่วย </p> <img src="${witness_sign}"/>
      <p>(${patient_contact_name})</p>
      <p>checkbox ไม่มีพยาบาลฝ่ายผู้ป่วย(เนื่องจากผู้ป่วยมาคนเดียว)</p>
      <p>พยานฝ่ายเจ้าหน้าที่</p> <img src="${nurse_sign}"/>
      <p>(${nurse_name})</p>
      <p>ตำแหน่ง พยาบาล/ผู้ช่วยพยาบาล</p>
      <p>พยานฝ่ายเจ้าหน้าที่</p> <img src="${staff_sign}"/>
      <p>(${staff_name})</p>
      <p>ตำแหน่ง ผู้ช่วยพยาบาล</p>
      </div>
  </body>
  </html>
  `;
};
