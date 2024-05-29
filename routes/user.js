const { Router } = require("express");
const {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/user");

const router = Router();

router.get("/", fetchUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/", deleteUser);

module.exports = router;
