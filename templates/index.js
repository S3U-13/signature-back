const simulationConsentForm = require("./simulationConsent");
const radiotherapyConsentForm = require("./radiotherapyConsent");
const brachytherapyConsentForm = require("./brachytherapyConsent");

const templateMap = {
  1: simulationConsentForm,
  2: radiotherapyConsentForm,
  3: brachytherapyConsentForm,
};

module.exports = templateMap;
