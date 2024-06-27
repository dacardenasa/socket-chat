const dbValidators = require("./db-validators");
const generateJWT = require("./generate-jwt");
const googleVerify = require("./google-verify");
const queries = require("./queries");
const uploadFile = require("./upload-file");

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...queries,
  ...uploadFile
};
