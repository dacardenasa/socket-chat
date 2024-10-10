const { Router } = require("express");
const { check } = require("express-validator");

const {
  login,
  googleSignIn,
  validateAccountByEmail,
  updateToken
} = require("../controllers");
const { validateFields, validateJWT } = require("../middlewares");
const {
  isUserAccountActive,
  isUserAccountRegistered,
  isUserAccountVerified
} = require("../helpers");

const router = Router();

router.get("/", validateJWT, updateToken);

router.post(
  "/login",
  [
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").notEmpty(),
    // check("email").custom(isUserAccountRegistered),
    // check("email").custom(isUserAccountActive),
    // check("email").custom(isUserAccountVerified),
    validateFields
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "Google token is required").notEmpty(), validateFields],
  googleSignIn
);

router.post(
  "/validateAccount",
  [
    check("email", "You must send the email").notEmpty(),
    check("email").custom(isUserAccountRegistered),
    check("email").custom(isUserAccountActive),
    validateFields
  ],
  validateAccountByEmail
);

module.exports = router;
