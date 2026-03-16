exports.signBase64 = (blob) => {
  if (!blob) return null;

  const base64 = blob.toString("base64");
  return `data:image/png;base64,${base64}`;
};
