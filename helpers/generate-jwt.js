const jwt = require("jsonwebtoken");
const User = require("../models/user");

function generateJWT(uid = "") {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h"
      },
      (error, token) => {
        error ? reject(error) : resolve(token);
      }
    );
  });
}

async function fetchUserWithToken(token = "") {
  try {
    if (token.length < 10) {
      return null;
    }
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if (!user) {
      return null;
    }

    if (!user.state) {
      return null;
    }

    return user;
  } catch (error) {
    console.info(error);
    return null;
  }
}

module.exports = {
  fetchUserWithToken,
  generateJWT
};
