const { Router } = require("express");
const { check } = require("express-validator");

const {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser
} = require("../controllers");

const {
  validateFields,
  hasRole,
  validateJWT,
  isAccountActivated
} = require("../middlewares");

const {
  hasUserRole,
  isUserRegisteredByEmail,
  isUserRegisteredById
} = require("../helpers");

const router = Router();

router.get("/", fetchUsers);

router.post(
  "/",
  [
    check("name", "The name is required").notEmpty(),
    check(
      "password",
      "The pasword is required y must have more than 6 characters"
    ).isLength({ min: 6 }),
    check("email", "The email address is not valid").isEmail(),
    // check("email").custom(isUserRegisteredByEmail),
    // check("role").custom(hasUserRole),
    validateFields
  ],
  createUser
);

router.put(
  "/:id",
  [
    validateJWT,
    isAccountActivated,
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(isUserRegisteredById),
    check("role").custom(hasUserRole),
    validateFields
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAccountActivated,
    hasRole("ADMIN_ROLE"),
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(isUserRegisteredById),
    validateFields
  ],
  deleteUser
);

module.exports = router;
