const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "The name of the product is required"],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  imageURI: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  }
});

ProductSchema.methods.toJSON = function () {
  const { __v, state, _id, ...restProduct } = this.toObject();
  return { ...restProduct, uid: _id };
};

module.exports = model("Product", ProductSchema);
