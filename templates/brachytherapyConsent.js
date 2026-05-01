const { FormateDate } = require("../utils/formateDate");
module.exports = (data, option, fontBase64) => {
  // set data form
  const form_type = data?.data_form?.form?.FormTypeName?.form_name ?? null;
  const date_form = data?.data_form?.form?.date_form ?? null;
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
  const staff_name = data?.data_form?.staff_user[0]?.person_name ?? null;
  const staff_position = data?.data_form?.staff_user[0]?.position ?? null;
  const nurse_name = data?.data_form?.nurse_user[0]?.person_name ?? null;
  const doctor_name = data?.data_form?.doctor_user?.person_name ?? null;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
          @font-face {
            font-family: 'Sarabun';
            src: url(data:font/truetype;base64,${fontBase64}) format('truetype');
          }
          body {
            font-family: 'Sarabun', sans-serif;
          }
        </style>
  </head>
  <body>
      <div class="space-y-6">
        <p class="text-xl font-semibold text-center">${form_type}โรงพยาบาลพระปกเกล้า</p>
        <div class="flex justify-end items-center">
          <p class="text-lg text-right">วันที่</p>
          <p class="relative inline-block px-2">${FormateDate(date_form)}
          <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
          </p>
        </div>
        <section class="text-lg space-y-2">
          <div class="flex">
            <div class="flex">
              <p>ข้าพเจ้า ชื่อ</p>
              <p class="w-60 relative inline-block px-2">${patient_contact_name}
               <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
              </p>
            </div>
            <div class="flex">
              <p>มีความสัมพันธ์เป็น</p>
              <p class="w-40 relative inline-block px-2">${relation}
               <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
              </p>
              <p>เกี่ยวข้องกับผู้ป่วย</p>
            </div>
          </div>
          <div class="flex">
            <div class="flex">
              <p>ชื่อ</p>
              <p class="w-40 relative inline-block px-2">${pat_name}
               <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
              </p>
            </div>
            <div class="flex">
              <p>เจ็บป่วยด้วยโรคมะเร็ง ปากมดลูก/มดลูก/</p>
              <p class="w-30 relative inline-block px-2">${disease}
               <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
              </p>
              <p>จะต้องเข้ารับการรักษาด้วยการใส่เเร่</p>
            </div>
          </div>
        </section>

        <section class="mt-2 text-lg space-y-2">
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
    
        <section class="text-lg space-y-4">
        <p class="text-xl text-center">การลงลายมือชื่อ</p>
        <div class="flex justify-end">
          <div>
            <div class="flex items-center gap-1">
              <p>ผู้ให้ข้อมูล</p>
              <div class="grid grid-cols-1 gap-1">
                  <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10 mx-auto" src="${doctor_sign}"/>
                  </div>
                  <div class="flex justify-center">
                      <span>(</span>
                        <p class="relative inline-block">${doctor_name}
                        <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                        </p>
                      <span>)</span>
                  </div>
              </div>
              <p>ตำเเหน่งเเพทย์</p>
            </div>

            <div class="flex items-center gap-1">
              <p>ผู้ให้คำยินยอม</p>
              <div class="grid grid-cols-1 gap-1">
                  <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10 mx-auto" src="${patient_sign}"/>
                  </div>
                  <div class="flex justify-center">
                      <span>(</span>
                        <p class="relative inline-block">${pat_name}
                        <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                        </p>
                      <span>)</span>
                  </div>
              </div>
              <p>ผู้ป่วย หรือ ผู้เเทนโดยชอบด้วยกฏหมาย</p>
            </div>

            <div>
              <div class="flex items-center gap-1">
                <p>พยานฝ่ายผู้ป่วย</p>
                <div class="grid grid-cols-1 gap-1">
                    <div class="w-full border-b border-dotted">
                     <img class="w-auto h-10 mx-auto" src="${witness_sign}"/>
                    </div>
                    <div class="flex justify-center">
                      <span>(</span>
                        <p class="relative inline-block">${patient_contact_name}
                        <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                        </p>
                      <span>)</span>
                    </div>
                </div>
              </div>
              <p class="indent-8">☐ ไม่มีพยานฝ่ายผู้ป่วย(เนื่องจากผู้ป่วยมาคนเดียว)</p>
            </div>

            <div class="flex items-center gap-1">
              <p>พยานฝ่ายเจ้าหน้าที่</p>
              <div class="grid grid-cols-1  gap-1">
                <div class="w-full border-b border-dotted">
                  <img class="w-auto h-10 mx-auto" src="${nurse_sign}"/>
                </div>
                <div class="flex justify-center">
                  <span>(</span>
                    <p class="relative inline-block">${nurse_name}
                    <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                    </p>
                  <span>)</span>
                </div>
              </div>
              <p>ตำแหน่งพยาบาล</p>
            </div>
            <div class="flex items-center gap-1">
              <p>พยานฝ่ายเจ้าหน้าที่</p>
              <div class="grid grid-cols-1 gap-1">
                <div class="w-full border-b border-dotted">
                  <img class="w-auto h-10 mx-auto" src="${staff_sign}"/>
                </div>
                <div class="flex justify-center">
                  <span>(</span>
                    <p class="relative inline-block">${staff_name}
                    <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                    </p>
                  <span>)</span>
                </div>
              </div>
              <p>ตำแหน่ง${staff_position}</p>
            </div>
          </div>
        </div>
        </section>
      </div>  
  </body>
  </html>
  `;
};
