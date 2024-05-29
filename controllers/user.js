const { response, request } = require("express");

const fetchUsers = (req = request, res = response) => {
  const { q, page = 1, limit = 10 } = req.query;
  res.json({
    msg: "GET API - CONTROLLER!",
    q,
    page,
    limit
  });
};

const createUser = (req, res = response) => {
  const { name, phone } = req.body;
  res.json({
    msg: "POST API - CONTROLLER!",
    name,
    phone
  });
};

const updateUser = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "PUT API - CONTROLLER!",
    id
  });
};

const deleteUser = (req, res = response) => {
  res.json({
    msg: "DELETE API - CONTROLLER!"
  });
};

module.exports = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
};
