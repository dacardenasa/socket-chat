const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const fetchUsers = async (req = request, res = response) => {
  const { q, page = 1, limit = 10 } = req.query;
  const previousRecords = (Number(page) - 1) * Number(limit);
  const query = {
    state: true
  };

  const [totalUsers, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(limit).skip(previousRecords)
  ]);
  const lastPage = Math.ceil(totalUsers / Number(limit));
  res.json({ users, page: Number(page), lastPage, totalUsers });
};

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);
  await user.save();
  res.json(user);
};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  let { _id, password, google, email, ...rest } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, { ...rest, password });

  res.json(user);
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;
  /*
    * Delete permanently existing user - not recommended
    const user = await User.findByIdAndDelete(id);
  */
  const user = await User.findByIdAndUpdate(id, { state: false });
  res.json({ user });
};

module.exports = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
};
