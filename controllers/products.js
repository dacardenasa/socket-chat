const { request, response } = require("express");
const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {
  const { page = 1, limit = 5 } = req.query;
  const previousRecords = (Number(page) - 1) * Number(limit);
  const query = {
    state: true
  };
  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .limit(limit)
      .skip(previousRecords)
      .populate("user", "name")
      .populate("category", "name")
      .exec()
  ]);
  const lastPage = Math.ceil(totalProducts / Number(limit));
  res.json({ products, page: Number(page), lastPage, totalProducts });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("user", "name")
    .exec();
  res.json(product);
};

const createProduct = async (req = request, res = response) => {
  const {
    name,
    category,
    price = 0,
    description = "",
    available = true
  } = req.body;

  const productDB = await Product.findOne({ name });
  if (productDB) {
    return res.status(401).json({
        message: `The product ${productDB.name} is already registered!`
    });
  }

  const data = {
    available,
    category,
    description,
    name: name.toUpperCase(),
    price: Number(price),
    user: req.authUser._id
  };
  const product = new Product(data);
  await product.save();
  res.status(201).json(product);
};

const updateProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    name,
    category,
    price = 0,
    description = "",
    available = true
  } = req.body;
  const data = {
    available,
    category,
    description,
    name,
    price: Number(price),
    user: req.authUser._id
  };
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(product);
};

const deleteProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.json(product);
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById
};
