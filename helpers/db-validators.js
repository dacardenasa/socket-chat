const Role = require("../models/role");
const User = require("../models/user");

async function validateAccountRole(role = "") {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} does not exist`);
  }
}

async function validateAccountByEmail(email = "") {
  const isEmailAlreadyRegistered = await User.findOne({ email });
  if (isEmailAlreadyRegistered) {
    throw new Error(`The email ${email} is already registered`);
  }
}

async function validateAccountById(id = "") {
  const isAccountAlreadyRegistered = await User.findById(id);
  if (!isAccountAlreadyRegistered) {
    throw new Error(`The user with id ${id} is not registered`);
  }
}

module.exports = {
  validateAccountRole,
  validateAccountByEmail,
  validateAccountById
};
