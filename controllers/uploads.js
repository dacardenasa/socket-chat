const { request, response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY
});

async function uploadfileToServer(req = request, res = response) {
  try {
    const { tempFileName } = await uploadFile({
      files: req.files,
      folder: "imgs"
    });
    res.json(tempFileName);
  } catch (e) {
    console.log(e);
    res.status(e.status).json({ msg: e.msg });
  }
}

async function updateImage(req = request, res = response) {
  const { id, collection } = req.params;
  let model;
  try {
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The user with id ${id} does not exists!` });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The product with id ${id} does not exists!` });
        }
        break;
      default:
        return res
          .status(500)
          .json({ msg: `Collection ${collection} is not handled` });
    }
    const { tempFileName } = await uploadFile({
      files: req.files,
      folder: collection
    });

    /*
     * logic to delete previous images collection from server
     *
     */
    if (model.imageURI) {
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.imageURI
      );
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }

    model.imageURI = tempFileName;
    await model.save();
    res.json({ model });
  } catch (e) {
    console.info(e);
    res.status(e?.status ?? 500).json({ msg: e?.message ?? e });
  }
}

async function updateImageToCloudinary(req = request, res = response) {
  const { id, collection } = req.params;
  let model;
  try {
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The user with id ${id} does not exists!` });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The product with id ${id} does not exists!` });
        }
        break;
      default:
        return res
          .status(500)
          .json({ msg: `Collection ${collection} is not handled` });
    }
    const { uploadPath } = await uploadFile({
      files: req.files,
      folder: collection
    });

    if (model.imageURI) {
      await cloudinary.uploader.destroy(model._id);
    }

    const { secure_url } = await cloudinary.uploader.upload(uploadPath, {
      public_id: model._id
    });
    fs.unlinkSync(uploadPath);
    model.imageURI = secure_url;
    await model.save();
    res.json(model);
  } catch (e) {
    console.info(e);
    res.status(e?.status ?? 500).json({ msg: e?.message ?? e });
  }
}

async function showImage(req = request, res = response) {
  const { id, collection } = req.params;
  let model;
  try {
    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The user with id ${id} does not exists!` });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `The product with id ${id} does not exists!` });
        }
        break;
      default:
        return res
          .status(500)
          .json({ msg: `Collection ${collection} is not handled` });
    }

    if (model.imageURI) {
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.imageURI
      );
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    }

    const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathNoImage);
  } catch (e) {
    console.info(e);
    res.status(e?.status ?? 500).json({ msg: e?.message ?? e });
  }
}

module.exports = {
  uploadfileToServer,
  updateImage,
  updateImageToCloudinary,
  showImage
};
