function CalculateAge(date) {
  const today = new Date();
  const dob = new Date(date);

  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // ถ้ายังไม่ถึงวันเกิดปีนี้ -> ลบ 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}

module.exports = {
  CalculateAge,
};
