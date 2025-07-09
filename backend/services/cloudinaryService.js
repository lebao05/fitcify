const cloudinary = require('../configs/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'uploads', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: options.resource_type || 'auto',
      use_filename: true,
      unique_filename: true,
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (err) {
    throw new Error('Upload to Cloudinary failed: ' + err.message);
  }
};

module.exports = { uploadToCloudinary };
