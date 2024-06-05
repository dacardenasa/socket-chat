const jwt = require("jsonwebtoken");

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

module.exports = {
  generateJWT
};
