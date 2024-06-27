const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateJWT,
  validateFields,
  validateFileUpload
} = require("../middlewares");
const {
  uploadfileToServer,
  showImage,
  updateImageToCloudinary
} = require("../controllers");
const { isCollectionRegistered } = require("../helpers");

const router = Router();

router.post("/", [validateJWT, validateFileUpload], uploadfileToServer);
router.put(
  "/:collection/:id",
  [
    validateJWT,
    validateFileUpload,
    check("id", "The id must be a valid mongoose id!").isMongoId(),
    check("collection").custom((c) =>
      isCollectionRegistered(c, ["users", "products"])
    ),
    validateFields
  ],
  updateImageToCloudinary
);

router.get(
  "/:collection/:id",
  [
    validateJWT,
    check("id", "The id must be a valid mongoose id!").isMongoId(),
    check("collection").custom((c) =>
      isCollectionRegistered(c, ["users", "products"])
    ),
    validateFields
  ],
  showImage
);

module.exports = router;
