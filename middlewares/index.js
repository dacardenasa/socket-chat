const validateFields = require("./validate-fields");
const validateAccount = require("./validate-account");
const validateJWT = require("./validate-jwt");
const validateRoles = require("./validate-role");

module.exports = {
  ...validateAccount,
  ...validateFields,
  ...validateJWT,
  ...validateRoles
};
