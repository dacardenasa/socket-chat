const { request, response } = require("express");

function isAccountActivated(req = request, res = response, next) {
  const { isAccountVerified, email } = req.authUser;
  if (!isAccountVerified) {
    return res.status(500).json({
      msg: "The account is not activated, please activate your account!",
      activationlink: `/auth/validateAccount/${email}`
    });
  }
  next();
}

module.exports = {
  isAccountActivated
};
