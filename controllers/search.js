const { request, response } = require("express");

const { allowedCollections } = require("../constants/global");
const { searchUsers, searchCategories, searchProducts } = require("../helpers");

const search = async (req = request, res = response) => {
  const { collection, term } = req.params;
  let results;
  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      message: `The collection ${collection} is not allowed`
    });
  }

  switch (collection) {
    case "users":
      results = await searchUsers(term);
      break;
    case "categories":
      results = await searchCategories(term);
      break;
    case "products":
      results = await searchProducts(term);
      break;
    default:
      res.status(500).json({
        message: "Search is not set"
      });
  }
  res.json({ results });
};

module.exports = {
  search
};
