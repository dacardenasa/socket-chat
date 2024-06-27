const validateAccount = require("./validate-account");
const validateFields = require("./validate-fields");
const validateFileUpload = require("./validate-file-upload");
const validateJWT = require("./validate-jwt");
const validateRoles = require("./validate-role");

module.exports = {
  ...validateAccount,
  ...validateFields,
  ...validateFileUpload,
  ...validateJWT,
  ...validateRoles
};
