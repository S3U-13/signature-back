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
  </body>
  </html>
  `;
};
