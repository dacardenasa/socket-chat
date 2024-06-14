const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function validateJWT(req = request, res = response, next) {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "AuthToken is required"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const authUser = await User.findById(uid);

        if (!authUser) {
            return res.status(401).json({
                msg: "user does not exist!"
            })
        }

        if (!authUser.state) {
            return res.status(401).json({
                msg: "Token is not valid - user disabled"
            })
        }

        req.authUser = authUser;
        next();
    } catch(error) {
        console.log(error);
        return res.status(401).json({
            msg: "AuthToken is invalid"
        })
    }
}

module.exports = {
    validateJWT,
}