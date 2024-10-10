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

async function isUserAccountRegistered(email = "") {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("The email is not registered in our DB!");
  }
}

async function isUserAccountActive(email = "") {
  const user = await User.findOne({ email });
  if (!user.state) {
    throw new Error(`The user ${email} is disabled!`);
  }
}

async function isUserAccountVerified(email = "") {
  const user = await User.findOne({ email });
  if (!user.isAccountVerified) {
    throw new Error(
      `The account is not activated, please check your email to activate it!`
    );
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

function isCollectionRegistered(collection = "", collections = []) {
  const isCollectionIncluded = collections.includes(collection);
  if (!isCollectionIncluded) {
    throw new Error(
      `The collection ${collection} is not allowed, collections allowed ${collections}`
    );
  }
  return true;
}

module.exports = {
  hasUserRole,
  isUserAccountRegistered,
  isUserAccountActive,
  isUserAccountVerified,
  isUserRegisteredByEmail,
  isUserRegisteredById,
  isCategoryRegistered,
  isCollectionRegistered,
  isProductRegistered
};
