exports.signBuffers = (signs) => {
  const result = {};

  for (const key in signs) {
    const dataUrl = signs[key];

    if (!dataUrl) {
      result[key] = null;
      continue;
    }
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    result[key] = Buffer.from(base64, "base64");
  }
  return result;
};
