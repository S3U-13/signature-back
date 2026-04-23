module.exports = (data) => {
  const form_type = data?.data_form?.form?.FormTypeName?.form_name ?? null;
  const pat_name = data.data_pat.pat
    ? `${data.data_pat.pat.prename}${data.data_pat.pat.firstname} ${data.data_pat.pat.lastname}`
    : null;
  const relation = data?.data_form?.patient_contact?.relation_name ?? null;
  const patient_contact_name = data?.data_pat?.patient_contact?.name ?? null;
  const disease = data?.data_form?.form?.disease ?? null;
  const consent_id = data?.data_form?.form?.consent ?? null;
  const consent_name = data?.data_form?.form?.ConsentName?.name ?? null;
  const lmp = data?.data_form?.form?.lmp ?? null;

  //map congenital_disease
  const congenital_disease = data?.data_form?.congenital_disease ?? [];

  //contrast_history_status
  const contrast_history_status =
    data?.data_form?.contrast_history_status ?? null;

  //contrast_allergy_status
  const contrast_allergy_id =
    data?.data_form?.contrast_allergy_status?.contrast_allergy_id ?? null;
  const contrast_allergy_symptom =
    data?.data_form?.contrast_allergy_status?.contrast_allergy_symptom ?? null;

  //seafood_allergy_status
  const seafood_allergy_id =
    data?.data_form?.seafood_allergy_status?.seafood_allergy_id ?? null;
  const seafood_allergy_symptom =
    data?.data_form?.seafood_allergy_status?.seafood_allergy_symptom ?? null;

  //drug_allergy_status
  const drug_allergy_id =
    data?.data_form?.drug_allergy_status?.drug_allergy_id ?? null;
  const drug = data?.data_form?.drug_allergy_status?.drug ?? null;

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

  const mapCongenitalDisease = congenital_disease?.map((i) => i.condition_id);
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
        <h1 class="text-sm font-semibold">${form_type}</h1>
        <p>Diagnosis: </p>
        <p>ข้าพเจ้า ชื่อ ${patient_contact_name}</p>
        <p>มีความสัมพันธ์เป็น ${relation} เกี่ยวข้องกับผู้ป่วย</p>
        <p>ชื่อ ${pat_name}</p>
        <p>เจ็บป่วยด้วยโรคมะเร็ง ปากมดลูก/มดลูก/${disease}</p>
        <p>จะต้องเข้ารับการรักษาด้วยการใส่เเร่</p>
        <p>ผู้ให้ข้อมูล ${doctor_sign}</p>
        <p>(${doctor_name})</p>
        <p>ตำเเหน่งเเพทย์</p>
        <p>ผู้ให้คำยินยอม ${patient_sign}</p>
        <p>(${pat_name})</p>
        <p>ผู้ป่วย หรือ ผู้เเทนโดยชอบด้วยกฏหมาย</p>
        <p>พยานฝ่ายผู้ป่วย ${witness_sign}</p>
        <p>(${patient_contact_name})</p>
        <p>checkbox ไม่มีพยาบาลฝ่ายผู้ป่วย(เนื่องจากผู้ป่วยมาคนเดียว)</p>
        <p>พยานฝ่ายเจ้าหน้าที่${nurse_sign}</p>
        <p>(${nurse_name})</p>
        <p>ตำแหน่ง พยาบาล/ผู้ช่วยพยาบาล</p>
        <p>พยานฝ่ายเจ้าหน้าที่${staff_sign}</p>
        <p>(${staff_name})</p>
        <p>ตำแหน่ง ผู้ช่วยพยาบาล</p>


        <p>1.ท่านมีโรคประจำตัวดคงต่อไปนี้หรือไม่</p>
        <p>${mapCongenitalDisease}</p>
        <p>2.ท่านเคยได้รับการฉีดสารทึบรังสีมาก่อนหรือไม่</p>
        <p>${contrast_history_status}</p>
        <p>3.ถ้าเคยตรวจท่านเเพ้สารทึบรังสีหรือไม่</p>
        <p>${contrast_allergy_id}</p>
        <p>${contrast_allergy_symptom}</p>
        <p>4.ท่านมีประวัติเเพ้อาหารทะเลหรือไม่</p>
        <p>${seafood_allergy_id}</p>
        <p>5.ท่านมีประวัติเเพ้ยาอื่นๆอีกหรือไม่</p>
        <p>${drug_allergy_id}</p>
        <p>${drug}</p>
        <p>6.ข้าพเจ้าขอรับรองว่าไม่ได้อยู่ในระหว่างตั้งครรภ์ ขณะได้รับการตรวจด้วยวิธีดังกล่าว</p>
        <p>(โดยประจำเดือนมาครั้งสุดท้ายวันที่ ${lmp})</p>
       
    </body>
  `;
};
