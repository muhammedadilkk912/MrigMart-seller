const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
 function uploadBufferToCloudinary(buffer) {
    console.log("inside uplod to cloudinary")
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'product-image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
module.exports = uploadBufferToCloudinary;
