const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder in Cloudinary to store the file
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'book-rental') => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
    });

    // Delete the local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      success: true
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};