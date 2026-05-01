function getLastMonths(n = 6) {
  const result = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toISOString().slice(0, 7); // YYYY-MM
    result.push(month);
  }

  return result;
}

module.exports = { getLastMonths };
