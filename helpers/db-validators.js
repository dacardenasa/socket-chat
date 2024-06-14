const { Role, User, Category, Product } = require("../models");

async function hasUserRole(role = "") {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} does not exist`);
  }
}

async function isUserRegisteredByEmail(email = "") {
  const isEmailAlreadyRegistered = await User.findOne({ email });
  if (isEmailAlreadyRegistered) {
    throw new Error(`The email ${email} is already registered`);
  }
}

async function isUserRegisteredById(id = "") {
  const isAccountAlreadyRegistered = await User.findById(id);
  if (!isAccountAlreadyRegistered) {
    throw new Error(`The user with id ${id} is not registered`);
  }
}

async function isCategoryRegistered(id = "") {
  const categoryDB = await Category.findById(id);
  if (!categoryDB) {
    throw new Error(`The category with id ${id} does not exist!`);
  }
}

async function isProductRegistered(id = "") {
  const productDB = await Product.findById(id);
  if (!productDB) {
    throw new Error(`The product with id ${id} does not exist!`);
  }
}

module.exports = {
  hasUserRole,
  isUserRegisteredByEmail,
  isUserRegisteredById,
  isCategoryRegistered,
  isProductRegistered
};
