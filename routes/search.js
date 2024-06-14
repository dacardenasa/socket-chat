const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares");
const { search } = require("../controllers");

const router = Router();

router.get('/:collection/:term', search)

module.exports = router;
