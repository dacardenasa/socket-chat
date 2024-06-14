const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const searchUsers = async (term = "") => {
  if (isValidObjectId(term)) {
    const product = await User.findById(term);
    return product ? [product] : [];
  }
  const regex = new RegExp(term, "i");
  const products = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }]
  });
  return products;
};

const searchCategories = async (term = "") => {
  if (isValidObjectId(term)) {
    const category = await Category.findById(term)
      .populate("user", "name")
      .exec();
    return category ? [category] : [];
  }
  const regex = new RegExp(term, "i");
  const categories = await Category.find({
    name: regex,
    state: true
  })
    .populate("user", "name")
    .exec();
  return categories;
};

const searchProducts = async (term = "") => {
  if (isValidObjectId(term)) {
    const product = await Product.findById(term)
      .populate("category", "name")
      .populate("user", "name")
      .exec();
    return product ? [product] : [];
  }
  const regex = new RegExp(term, "i");
  const product = await Product.find({
    name: regex,
    state: true
  })
    .populate("category", "name")
    .populate("user", "name")
    .exec();
  return product;
};

module.exports = {
  searchUsers,
  searchCategories,
  searchProducts
};
