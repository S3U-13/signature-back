const { CalculateAge } = require("../utils/calculateAge");

module.exports = (data, option, fontBase64) => {
  const form_type = data?.data_form?.form?.FormTypeName?.form_name ?? null;
  const hn = data?.data_pat?.pat?.hn ?? null;
  const pat_name = data.data_pat.pat
    ? `${data.data_pat.pat.prename}${data.data_pat.pat.firstname} ${data.data_pat.pat.lastname}`
    : null;
  const pat_weight = data?.data_pat?.pat_vitalsign?.weight ?? null;
  const relation = data?.data_form?.patient_contact?.relation_name ?? null;
  const patient_contact_name = data?.data_form?.patient_contact?.name ?? null;
  const disease = data?.data_form?.form?.disease ?? null;
  const consent_id = data?.data_form?.form?.consent ?? null;
  const consent = data?.data_form?.form?.consent ?? null;
  const lmp = data?.data_form?.form?.lmp ?? null;

  const pat_agn = data?.data_pat?.pat?.birthdatetime
    ? CalculateAge(data?.data_pat?.pat?.birthdatetime)
    : null;

  //map congenital_disease
  const congenital_disease = data?.data_form?.congenital_disease ?? [];

  //contrast_history_status
  const contrast_history_status =
    data?.data_form?.contrast_history_status?.contrast_history_id ?? null;

  //contrast_allergy_status
  const contrast_allergy_id =
    data?.data_form?.contrast_allergy_status?.contrast_allergy_id ?? null;
  const contrast_allergy_symptom =
    data?.data_form?.contrast_allergy_status?.contrast_allergy_symptom ?? "";

  //seafood_allergy_status
  const seafood_allergy_id =
    data?.data_form?.seafood_allergy_status?.seafood_allergy_id ?? null;
  const seafood_allergy_symptom =
    data?.data_form?.seafood_allergy_status?.seafood_allergy_symptom ?? "";

  //drug_allergy_status
  const drug_allergy_id =
    data?.data_form?.drug_allergy_status?.drug_allergy_id ?? null;
  const drug = data?.data_form?.drug_allergy_status?.drug ?? "";

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

  //option
  const choice1 = option.filter((i) => i.option_group_id === 7); // คำถามโรคประจำตัว

  const choice_group_1 = option.filter((i) => i.option_group_id === 1); // ตัวเลือก เคย , ไม่เคย , จำไม่ได้
  const choice_group_2 = option.filter((i) => i.option_group_id === 2); // ตัวเลือก เคย , ไม่เคย , จำไม่ได้

  const choice_group_3 = option.filter((i) => i.option_group_id === 3); // ตัวเลือก มี , ไม่มี , จำไม่ได้

  const choice_group_4 = option.filter((i) => i.option_group_id === 4); // คำถามหมวดยินยอมโดยการใช้รังสีเอกซเรย์เเละสารทึบรังสี

  //note
  const cr = data?.data_form?.staff_note?.cr ?? "-";
  const egfr = data?.data_form?.staff_note?.egfr ?? "-";
  const contrast_media = data?.data_form?.staff_note?.contrast_media ?? "-";
  const volume_cc = data?.data_form?.staff_note?.volume_cc ?? "-";
  const note = data?.data_form?.staff_note?.note ?? "-";

  //map
  const selectedDiseaseIds = congenital_disease?.map((i) => i.condition_id);

  // const renderCheckbox = (checked) =>
  //   checked ? "☑ มี ☐ ไม่มี" : "☐ มี ☑ ไม่มี";

  const renderCheckbox = (checked) => `
  <span>${checked ? "☑" : "☐"} มี</span>
  <span class="">
    ${checked ? "☐" : "☑"} ไม่มี
  </span>
`;

  const renderCheckbox2 = (checked) => (checked ? "☑" : "☐");

  const congenitalHTML = choice1
    .map((item) => {
      const isChecked = selectedDiseaseIds.includes(item.id);

      return `
      <div class="grid grid-cols-[100px_auto] items-center">
        <span>${item.name}</span>
        <span class="space-x-4">${renderCheckbox(isChecked)}</span>
      </div>
    `;
    })
    .join("");

  const renderOptions = (choices, selectedId) =>
    choices
      .map((item) => {
        const isChecked = selectedId === item.id;
        return `
        <div class="grid grid-cols-[auto_1fr] gap-4">
          <div class="flex gap-1">
            <span>${renderCheckbox2(isChecked)}</span>
            <span>${item.name}</span>
          </div>
        </div>
      `;
      })
      .join("");

  const contrastHistoryHTML = renderOptions(
    choice_group_2,
    contrast_history_status,
  );

  const contrastAllergyHTML = renderOptions(
    choice_group_2,
    contrast_allergy_id,
  );

  const seafoodAllergyHTML = renderOptions(choice_group_1, seafood_allergy_id);

  const drugAllergyHTML = renderOptions(choice_group_3, drug_allergy_id);

  const consentHTML = renderOptions(choice_group_4, consent);

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
        <h1 class="text-lg font-semibold text-center">หนังสืออธิบายเเละยินยอมให้ทำการจำลองการฉายรังสีโดยใช้รังสีเอกซเรย์เเละสารทึบรังสี</h1>

        <section class="flex items-start justify-between gap-2">
          <div class="space-y-3.5 w-full mt-2">
            <p class="text-lg text-center pl-35 font-semibold">หน่วยงานรังสีรักษาโรงพยาบาลพระปกเกล้า</p>
            <div class="text-md flex items-end">
              <div class="flex">
                <p>ชื่อ-สกุล ผู้ป่วย </p>
                <p class="w-45 relative inline-block px-2">${pat_name}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>
              <div class="flex">
              <p>อายุ</p>
                <p class="relative inline-block w-15 px-2 text-center">${pat_agn}
                <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p> 
                <p>ปี</p>
              </div>  
               <div class="flex">
              <p class="pl-2"> HN </p>
                <p class="relative inline-block w-25 px-2">${hn} 
                <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>  
            </div> 
            <div class="text-md flex items-center">
             <div class="flex">
                <p>วันที่ตรวจ </p>
                <p class="w-35 relative inline-block px-2">-
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>
             <div class="flex">
                <p>วันที่ตรวจ </p>
                <p class="w-20 relative inline-block px-2 text-center">${pat_weight}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
                <p>กิโลกรัม</p>
              </div>
            </div> 
          </div>
          <div class="text-sm border p-2 w-70 space-y-1">
            <p>สำหรับเจ้าหน้าที่</p>
            <div class="flex items-center gap-2">
             <div class="flex">
                <p>Cr</p>
                <p class="w-16 relative inline-block px-2">${cr}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>
             <div class="flex">
                <p>eGFR</p>
                <p class="w-16 relative inline-block px-2">${egfr}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>
            </div>
            <p>(ต้องมี Cr ≤ 1.5 mg%, eGFR ≥ 45)</p>
            <div class="flex">
                <p>Contrast media</p>
                <p class="w-25 relative inline-block px-2">${contrast_media}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
            </div>
            <div class="flex">
                <p>ปริมาณ</p>
                <p class="w-30 relative inline-block px-2">${contrast_media}
                 <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
                <p>CC</p>
            </div>
          </div>
        </section>     

        <section class="text-md">
          <p class="indent-8">
            ท่านกำลังจะเข้ารับการตรวจทางรังสีโดยใช้รังสีเอกซเรย์ หรือการฉีดสารทึบรังสีร่วมกับการเอกซเรย์ ซึ่งในการตรวจนี้เเพทย์/เจ้าหน้าที่จะใช้สารทึบรังสีฉีดผ่านทางหลอดเลือดดำ หลังจากนั้นจึงเอกซเรย์ ในการตรวจดังกล่าว อาจมีโอกาสเกิดการเเพ้ต่อสารทึบรังสีได้ดังนี้
          </p>
          <p class="indent-8">
            1. เเพ้เล็กน้อย ได้เเก่ คลื่นไส้/อาเจียน จาม ผื่นคัน มีไข้
          </p>
          <p class="indent-8">
            2.เเพ้ปานกลางถึงมาก ได้เเก่ หายใจขัด ความดันโลหิตต่ำ หัวใจเต้นช้า หน้าบวม ปากบวม กล่องเสียงบวม ไตวาย ชัก หรืออาจเสียชีวิตได้
          </p>
          <p class="indent-11">
            อย่างไรก็ตามทางหน่วยงานรังสีรักษาได้ตามมาตรการในการป้องกันเเละรักษาอาการเเพ้ที่เกิดจากการตรวจดังกล่าว ทั้งนี้เพื่อป้องกันอันตรายที่อาจเกิดขึ้น กรุณาตอบคำถามต่อไปนี้ เพื่อตรวจหาความเสี่ยงต่อการเอกซเรย์หรือฉีดสารทึบรังสี
          </p>
        </section>

        <section>
          <div class="text-md space-y-1">
              <div class="">
                <p class="pl-8">1.ท่านมีโรคประจำตัวดังต่อไปนี้หรือไม่</p>
                <div class="pl-16 grid grid-cols-2 gap-x-2">
                  ${congenitalHTML}
                </div>
                <div>
              </div>
              <div class="flex">
                <p class="pl-8 w-65">2.ท่านเคยได้รับการฉีดสารทึบรังสีมาก่อนหรือไม่</p>
                <div class=" flex item-center gap-2">
                  ${contrastHistoryHTML}
                </div>
              </div>
              <div class="flex">
                <p class="pl-8 w-65">3.ถ้าเคยตรวจท่านเเพ้สารทึบรังสีหรือไม่</p>
                <div class=" flex item-center gap-2">
                  ${contrastAllergyHTML}
                  <p>${contrast_allergy_symptom}</p>
                </div>
              </div>
              <div class="flex">
                <p class="pl-8 w-65">4.ท่านมีประวัติเเพ้อาหารทะเลหรือไม่</p>
                <div class=" flex item-center gap-2">
                  ${seafoodAllergyHTML}
                  <p>${seafood_allergy_symptom}</p>
                </div>
              </div>
              <div class="flex">
                <p class="pl-8 w-65">5.ท่านมีประวัติเเพ้ยาอื่นๆอีกหรือไม่</p>
                <div class=" flex item-center gap-2">
                  ${drugAllergyHTML}
                  <p>${drug}</p>
                </div>
              </div>
              <div>
              <p class="pl-8">6.ข้าพเจ้าขอรับรองว่าไม่ได้อยู่ในระหว่างตั้งครรภ์ ขณะได้รับการตรวจด้วยวิธีดังกล่าว</p>
              <p class="pl-16">(โดยประจำเดือนมาครั้งสุดท้ายวันที่ ${lmp})</p>
              </div>
          </div>
        </section>
       
        <section class="text-md space-y-1 ">
          <div class="flex">
            <p>ข้าพเจ้า </p>
            <p class="w-30 relative inline-block px-2 w-55">${patient_contact_name}
             <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
            </p>
            <p>ผู้ป่วย/ตัวเเทนผู้ป่วย</p>
            <p class="pl-2">โดยเกี่ยวข้องเป็น</p>
            <p class="relative inline-block px-2 w-35">${relation}
            <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
            </p>
            <p>ของผู้ป่วย</p>
          </div>
       
          <div class="flex">
            <p>ชื่อ</p>
            <p class="w-30 relative inline-block px-2 w-55">${pat_name}
             <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
            </p>
            <p>ได้รับทราบคำอธิบายข้างต้น รวมทั้งผลเเทรกซ้อนที่อาจจะเกิดขึ้นจากการตรวจดังกล่าว โดยข้าพเจ้า</p>
          </div>
          <div class="flex justify-center gap-6">
            ${consentHTML} จึงได้ลงลายมือชื่อไว้เป็นหลักฐาน
          </div>
        </section>

        <section class="text-md grid grid-cols-2 items-end">
            <div class="p-2 border relative h-65 mt-4">
              <p>สำหรับเจ้าหน้าที่</p>
              <p>บันทึก(กรณีผู้ป่วยเเพ้สารทึบรังสี)</p>
              <p>..............................................................................................................................</p>
              <p>..............................................................................................................................</p>
              <p>..............................................................................................................................</p>
              <p>..............................................................................................................................</p>
              <div class="absolute right-2">
                <div class="flex items-center gap-1">
                  <p>ลงชื่อ</p>
                  <div class="grid grid-cols-1 gap-1">
                    <div class="w-full border-b border-dotted">
                      <img class="w-auto h-10 " src="${staff_sign}"/>
                    </div>
                    <div class="flex justify-center">
                      <span>(</span>
                        <p class="relative inline-block">${staff_name}
                        <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                        </p>
                      <span>)</span>
                    </div>
                  </div>
                </div>
                  <div class="flex justify-center">
                    <p>ตำเเหน่ง</p>
                    <p class="relative inline-block px-2">${staff_position}
                    <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                    </p>
                  </div>
              </div>
            </div>
            <div class="pl-16">
              <div class="flex items-center gap-1">
                <p>ลงชื่อ</p>
                <div class="grid grid-cols-1 gap-1">
                  <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10  mx-auto" src="${patient_sign}"/>
                  </div>
                  <div class="flex justify-center">
                  <span>(</span>
                    <p class="relative inline-block">${pat_name}
                    <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                    </p>
                  <span>)</span>
                  </div>
                </div>
                <p>ผู้ป่วย/ตัวเเทนผู้เเทน</p>
              </div>
              <div class="flex items-center gap-1">
                <p>ลงชื่อ</p>
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
                <p>เเพทย์</p>
              </div>
              <div class="flex items-center gap-1">
                <p>ลงชื่อ</p>
                <div class="grid grid-cols-1  gap-1">
                  <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10  mx-auto" src="${staff_sign}"/>
                  </div>
                  <div class="flex justify-center">
                    <span>(</span>
                      <p class="relative inline-block">${staff_name}
                      <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                      </p>
                    <span>)</span>
                  </div>
                </div>
                <p>${staff_position}</p>
              </div>
              <div class="flex items-center gap-1">
                <p>ลงชื่อ</p>
                <div class="grid grid-cols-1  gap-1">
                  <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10  mx-auto" src="${nurse_sign}"/>
                  </div> 
                  <div class="flex justify-center">
                    <span>(</span>
                      <p class="relative inline-block">${nurse_name}
                      <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                      </p>
                    <span>)</span>
                  </div>
                </div>
                <p>พยาบาล</p>
              </div>

              <div>
                <div class="flex items-center gap-1">
                  <p>ลงชื่อ</p>
                  <div class="grid grid-cols-1 gap-1">
                    <div class="w-full border-b border-dotted">
                    <img class="w-auto h-10  mx-auto" src="${witness_sign}"/>
                    </div>
                      <div class="flex justify-center">
                        <span>(</span>
                          <p class="relative inline-block">${patient_contact_name}
                          <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                          </p>
                        <span>)</span>
                      </div>
                  </div>
                  <p>พยาน</p>
                </div>
              </div>
              <div class="flex">
                <p>วันที่</p>
                <p class="w-40 relative inline-block">-
                <span class="absolute left-0 right-0 bottom-1 border-b border-dotted"></span>
                </p>
              </div>
            </div>
        </section>    
    </body>
  `;
};
