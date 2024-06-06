const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const { generateJWT, googleVerify } = require("../helpers");
const User = require("../models/user");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: `The email or password is incorrect!`
      });
    }

    if (!user.state) {
      return res.status(400).json({
        error: `The user ${email} is disabled!`
      });
    }

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

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        role: "USER_ROLE",
        img,
        google: true
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

module.exports = {
  login,
  googleSignIn
};
