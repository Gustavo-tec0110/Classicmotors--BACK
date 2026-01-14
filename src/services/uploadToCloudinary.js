const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadBuffer(buffer, originalName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "webmotors",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = {
  uploadBuffer
};

