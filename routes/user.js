const { Router } = require("express");
const {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/user");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
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
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateAccountById),
    validateFields
  ],
  deleteUser
);

module.exports = router;
