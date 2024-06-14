const { request, response } = require("express");
const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {
  const { page = 1, limit = 5 } = req.query;
  const previousRecords = (Number(page) - 1) * Number(limit);
  const query = {
    state: true
  };
  const [totalCategories, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .limit(limit)
      .skip(previousRecords)
      .populate("user", "name")
      .exec()
  ]);
  const lastPage = Math.ceil(totalCategories / Number(limit));
  res.json({ categories, page: Number(page), lastPage, totalCategories });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name").exec();
  res.json(category);
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      message: `The category ${categoryDB.name} is already registered!`
    });
  }
  const data = {
    name,
    user: req.authUser._id
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const name = req.body.name.toUpperCase();
  const data = {
    name,
    user: req.authUser._id
  };
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(category);
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.json(category);
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
