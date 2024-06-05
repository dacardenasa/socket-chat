const { Router } = require("express");
const { check } = require("express-validator");

const {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} = require("../controllers/user");

const { validateFields, validarJWT, hasRole } = require("../middlewares");

const {
  validateAccountRole,
  validateAccountByEmail,
  validateAccountById
} = require("../helpers/db-validators");

const router = Router();

router.get("/", fetchUsers);

router.post(
  "/",
  [
    check("name", "The name is required").not().isEmpty(),
    check(
      "password",
      "The pasword is required y must have more than 6 characters"
    ).isLength({ min: 6 }),
    check("email", "The email address is not valid").isEmail(),
    check("email").custom(validateAccountByEmail),
    check("role").custom(validateAccountRole),
    validateFields
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateAccountById),
    check("role").custom(validateAccountRole),
    validateFields
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validarJWT,
    // validateAdminRole,
    hasRole("ADMIN_ROLE", "SELLER_ROLE"),
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateAccountById),
    validateFields
  ],
  deleteUser
);

module.exports = router;
