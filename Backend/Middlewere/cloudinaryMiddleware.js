const multer = require('multer');
const path = require('path');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Configure multer storage for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp'); // Temporary storage before uploading to Cloudinary
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  } 
});

// Middleware to handle profile picture uploads
const uploadProfilePic = upload.single('profilePic');

// Middleware to handle book image uploads
const uploadBookPic = upload.single('bookPic');

// Middleware to upload file to Cloudinary after multer processes it
const uploadToCloud = (folderName) => async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, folderName);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error uploading to Cloudinary',
        error: result.error
      });
    }

    // Add Cloudinary URL and public_id to request object
    req.cloudinaryResult = {
      url: result.url,
      public_id: result.public_id
    };
    
    next();
  } catch (error) {
    console.error('Error in cloudinary middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during file upload',
      error: error.message
    });
  }
};

module.exports = {
  uploadProfilePic,
  uploadBookPic,
  uploadToCloud
};