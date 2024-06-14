const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, hasRole } = require("../middlewares");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById
} = require("../controllers");
const { isProductRegistered } = require("../helpers");

const router = Router();

router.get("/", getProducts);
router.get(
  "/:id",
  [
    check("id", "Must be a mongoose id valid!").isMongoId(),
    check("id").custom(isProductRegistered),
    validateFields
  ],
  getProductById
);
router.post(
  "/",
  [
    validateJWT,
    check("name", "The field name is required").notEmpty(),
    check("category", "Must be a mongoose category id valid!").isMongoId(),
    validateFields
  ],
  createProduct
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Must be a mongoose id valid!").isMongoId(),
    check("category", "Must be a mongoose category id valid!").isMongoId(),
    check("id").custom(isProductRegistered),
    validateFields
  ],
  updateProductById
);
router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE", "SELLER_ROLE"),
    check("id", "Must be a mongoose id valid!").isMongoId(),
    check("id").custom(isProductRegistered),
    validateFields
  ],
  deleteProductById
);

module.exports = router;
