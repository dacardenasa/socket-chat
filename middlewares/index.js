const validateFields = require("./validate-fields");
const validarJWT = require("./validate-jwt");
const validateRoles = require("./validate-role");

module.exports = {
  ...validateFields,
  ...validarJWT,
  ...validateRoles
};
