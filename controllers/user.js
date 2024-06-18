const { response, request } = require("express");

const brevo = require("@getbrevo/brevo");
const bcrypt = require("bcryptjs");

const { User, Email } = require("../models");

let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_kEY;

const fetchUsers = async (req = request, res = response) => {
  const { page = 1, limit = 10 } = req.query;
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
  let apiInstance = new brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  const emailHandler = new Email(sendSmtpEmail, apiInstance);
  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);
  await user.save();
  await emailHandler.send({
    subject: "Account activation",
    content: `<html><body><h1>Common: This is your account activation link</h1><a href='${process.env.SINGLE_SPA_URL}/api/auth/validateAccount/${email}'>Activate Account</a></a></body></html>`,
    sender: { name: "Diego Cardenas", email: "diego.colombia.devs@gmail.com" },
    replyTo: { name: "Diego Alterno", email: "diego.cardenasaleg@gmail.com" },
    destinataries: [{ name: "Yuli Valencia", email }]
  });
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
