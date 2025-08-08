const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer, folderName = null, filename = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: folderName,
    };

    // If a filename is provided, set it as public_id
    if (filename) {
      uploadOptions.public_id = filename;
      uploadOptions.overwrite = true; // Optional: allow replacing existing file
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
