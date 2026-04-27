module.exports = (data, option, fontBase64) => {
  const form_type = data?.data_form?.form?.FormTypeName?.form_name ?? null;
  const pat_name = data.data_pat.pat
    ? `${data.data_pat.pat.prename}${data.data_pat.pat.firstname} ${data.data_pat.pat.lastname}`
    : null;
  const relation = data?.data_form?.patient_contact?.relation_name ?? null;
  const patient_contact_name = data?.data_form?.patient_contact?.name ?? null;
  const disease = data?.data_form?.form?.disease ?? null;
  const consent_id = data?.data_form?.form?.consent ?? null;
  const consent = data?.data_form?.form?.consent ?? null;

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

  const choice_group_5 = option.filter((i) => i.option_group_id === 5); // คำถามหมวดยินยอมโดยการใช้รังสีเอกซเรย์เเละสารทึบรังสี
  const renderCheckbox2 = (checked) => (checked ? "☑" : "☐");
  const renderOptions = (choices, selectedId) =>
    choices
      .map((item) => {
        const isChecked = selectedId === item.id;
        return `
        <div class="grid grid-cols-[auto_1fr] gap-2">
          <span class="indent-8">${renderCheckbox2(isChecked)}</span>
          <span>${item.name}</span>
        </div>
      `;
      })
      .join("");
  const consentHTML = renderOptions(choice_group_5, consent);

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
      <h1 class="text-xl font-semibold text-center">${form_type}</h1>
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
            <p class="w-60 relative inline-block px-2">${pat_name}
             <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
            </p>
          </div>
          <div class="flex">
            <p>เจ็บป่วยด้วยโรค</p>
            <p class="w-35 relative inline-block px-2">${disease}
             <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
            </p>
            <p>จะต้องเข้ารับการรักษาด้วยการฉายรังสี</p>
          </div>
        </div>
      </section>
      <section class="mt-2 text-lg space-y-2">
          <p class="indent-8">
           ข้าพเจ้าเเละผู้เเทนของข้าพเจ้า
           เข้าใจถึงวิธีการรักษาด้วยรังสี คือ
           การฉายรังสีด้วยเครื่องฉายภาพนอกร่างกายผ่านตัวผู้ป่วยในท่านอนบนเตียงเฉพาะ
           โดยต้องสามารถนอนได้อย่างสงบเป็นเวลาอย่างน้อยประมาณ 15 นาที
          </p>
          <p class="indent-8">
            ประโยชน์ที่คาดว่าจะได้รับจากการรักษาด้วยรังสี
            คือเพิ่มโอกาสหายขาดจากโรคมะเร็งดังกล่าว
          </p>
          <p class="indent-8">
             ข้าพเจ้าได้ทราบถึงประโยชน์ที่คาดว่าจะได้รับจากการรักษาด้วยรังสี
           เเละ ภาวะเเทรกซ้อนที่อาจเกิดจากการรักษาด้วยรังสี
           ทั้งที่อาจเกิดระหว่างการฉายรังสี
          </p>
          <p class="indent-8 mt-12">
            ข้าพเจ้าเเละผู้เทนของข้าพเจ้าเข้าใจถึงข้อมูลอันเป็นประโยชน์ดังกล่าว
           เเละซักถามข้อมูลอันเป็นประโยชน์ต่อการตัดสินใจได้ครบถ่วนเเล้ว
          </p>
        </section>
        <section>
          <div class="text-lg">
            ${consentHTML}
          </div>
        </section>
      <section class="text-lg">
        <p>การลงนาม</p>
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
            <p class="indent-8">☐ ไม่มีพยาบาลฝ่ายผู้ป่วย(เนื่องจากผู้ป่วยมาคนเดียว)</p>
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
      </section>
    </div>
  </body>
  </html>
  `;
};
