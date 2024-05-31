const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name of the user is required"]
  },
  email: {
    type: String,
    required: [true, "The email of the user is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "The password of the user is required"]
  },
  imageURI: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);
