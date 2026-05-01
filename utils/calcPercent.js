function calcPercent(cur, prev) {
  const currentVal = Number(cur || 0);
  const prevVal = Number(prev || 0);

  // 👉 ไม่มีข้อมูลเปรียบเทียบ
  if (prevVal === 0) {
    return {
      percent: 0,
      trend: "neutral",
    };
  }

  const percent = Number((((currentVal - prevVal) / prevVal) * 100).toFixed(0));

  let trend = "neutral";

  if (percent > 0) trend = "up";
  else if (percent < 0) trend = "down";

  return {
    percent,
    trend,
  };
}

module.exports = {
  calcPercent,
};
