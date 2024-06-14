const { request, response } = require("express");

function hasRole(...roles) {
  return function (req = request, res = response, next) {
    if (!req.authUser) {
      return res.status(500).json({
        msg: "AuthUser is required!"
      });
    }

    const { name, role } = req.authUser;

    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `User ${name} has no permissions to process this action!`
      });
    }
    next();
  };
}

module.exports = {
  hasRole
};
