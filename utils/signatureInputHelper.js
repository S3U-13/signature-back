exports.base64ToBuffer = async (dataUrl) => {
  if (!dataUrl) return null;

  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
};
