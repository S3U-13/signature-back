function FormateDate(dateInput) {
  const date = new Date(dateInput);

  const thaiMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day}/${month}/${year}`;
}

module.exports = {
  FormateDate,
};
