const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const { generateJWT, googleVerify } = require("../helpers");
const { User } = require("../models");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isTheSamePassword = bcrypt.compareSync(password, user.password);
    if (!isTheSamePassword) {
      return res.status(400).json({
        error: `The email or password is incorrect!`
      });
    }

    const token = await generateJWT(user._id);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "There was an error"
    });
  }
};

async function googleSignIn(req, res = response) {
  try {
    const { id_token } = req.body;
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOneAndUpdate(
      { email },
      { isAccountVerified: true }
    );

    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        role: "USER_ROLE",
        img,
        google: true,
        isAccountVerified: true
      };
      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "Your user is disabled, contact your administrator"
      });
    }

    const token = await generateJWT(user._id);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Google signin failed"
    });
  }
}

async function validateAccountByEmail(req = request, res = response, next) {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isAccountVerified: true },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "There was a problem activating your account"
    });
  }
}

module.exports = {
  login,
  googleSignIn,
  validateAccountByEmail
};
