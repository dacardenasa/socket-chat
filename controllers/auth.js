const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    // Validate if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: `The email or password is incorrect!`
      });
    }
    // Si el usuario esta activo
    if (!user.state) {
      return res.status(400).json({
        error: `The user ${email} is disabled!`
      });
    }
    // Verificar el password
    const isTheSamePassword = bcrypt.compareSync(password, user.password);
    if (!isTheSamePassword) {
      return res.status(400).json({
        error: `The email or password is incorrect!`
      });
    }
    // Generar el JWT
    const token = await generateJWT(user._id);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "There was an error"
    });
  }
};

module.exports = {
  login
};
