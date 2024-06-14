const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, hasRole } = require("../middlewares");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers");
const { isCategoryRegistered } = require("../helpers");

const router = Router();

router.get("/", getCategories);
router.get(
  "/:id",
  [
    check("id", "Must be an mongoose id valid!").isMongoId(),
    check("id").custom(isCategoryRegistered),
    validateFields
  ],
  getCategoryById
);
router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").notEmpty(),
    validateFields
  ],
  createCategory
);
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Must be an mongoose id valid!").isMongoId(),
    check("name", "The name is required").notEmpty(),
    check("id").custom(isCategoryRegistered),
    validateFields
  ],
  updateCategory
);
router.delete(
  "/:id",
  [
    validateJWT,
    hasRole("ADMIN_ROLE", "SELLER_ROLE"),
    check("id", "Must be an mongoose id valid!").isMongoId(),
    check("id").custom(isCategoryRegistered),
    validateFields
  ],
  deleteCategory
);

module.exports = router;
