function emptyToNull(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = obj[key] === "" || obj[key] === undefined ? null : obj[key];
  }
  return result;
}

module.exports = {
  emptyToNull,
};
