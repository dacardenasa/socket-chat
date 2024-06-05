const { request, response } = require("express");

function validateAdminRole(req = request, res = response, next) {
  if (!req.authUser) {
    return res.status(500).json({
      msg: "AuthUser is required!"
    });
  }
  const { name, role } = req.authUser;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `User ${name} has no permissions to process this action!`
    });
  }
  next();
}

function hasRole(...roles) {
  return function (req, res, next) {
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
  validateAdminRole,
  hasRole
};
