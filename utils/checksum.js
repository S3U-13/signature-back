const crypto = require("crypto");

function generateChecksum(data) {
  return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
}

module.exports = {
  generateChecksum,
};
