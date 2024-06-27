const path = require("path");
const { fileExtensionsAllowed } = require("../constants/global");
const { v4: uuidv4 } = require("uuid");

function uploadFile({
  files,
  validExtensions = fileExtensionsAllowed,
  folder = ""
}) {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const fileSlice = file.name.split(".");
    const fileExtension = fileSlice[fileSlice.length - 1];

    if (!validExtensions.includes(fileExtension)) {
      reject({
        status: 400,
        msg: `The extension ${fileExtension} is not allowed, valid extensions ${validExtensions}`
      });
    }

    const tempFileName = `${uuidv4()}.${fileExtension}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      tempFileName
    );

    file.mv(uploadPath, function (err) {
      if (err) {
        reject({
          status: 500,
          msg: err
        });
      }
      resolve({ uploadPath, tempFileName });
    });
  });
}

module.exports = {
  uploadFile
};
