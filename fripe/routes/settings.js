const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Settings = require('../models/settings');
const Brand = require('../models/brand');
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Configuration for Settings
const settingsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'settings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

// Multer Storage Configuration for Brands
const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 150, height: 150, crop: 'fill' }]
  },
});

const settingsUpload = multer({
  storage: settingsStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

const brandUpload = multer({
  storage: brandStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and SVG files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

// Error Handler Middleware
const handleError = (err, res) => {
  console.error('Error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  return res.status(500).json({ message: 'Server error', error: err.message });
};

// Wrapper for async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => handleError(error, res));
};

// Get Banner Image
router.get('/banner', asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  if (!settings || !settings.bannerUrl) {
    return res.status(404).json({ message: 'Banner image not found' });
  }
  res.json({ imageUrl: settings.bannerUrl });
}));

// Get Pub Image
router.get('/pub', asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  if (!settings || !settings.pubUrl) {
    return res.status(404).json({ message: 'Pub image not found' });
  }
  res.json({ imageUrl: settings.pubUrl });
}));

// Update Image Function
const updateImage = async (req, res, imageType) => {
  // Handle file upload
  settingsUpload(req, res, async (err) => {
    try {
      if (err) {
        return handleError(err, res);
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      const oldImagePublicId = settings[`${imageType}PublicId`];

      // Delete old image if exists
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'settings',
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      });

      // Update settings with new image info
      settings[`${imageType}Url`] = result.secure_url;
      settings[`${imageType}PublicId`] = result.public_id;
      await settings.save();

      res.json({
        message: `${imageType} image updated successfully`,
        imageUrl: result.secure_url
      });
    } catch (error) {
      handleError(error, res);
    }
  });
};

// Update Routes
router.put('/banner', (req, res) => updateImage(req, res, 'banner'));
router.put('/pub', (req, res) => updateImage(req, res, 'pub'));

// Brand Routes
router.get('/brands', asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ createdAt: -1 });
  res.json(brands);
}));

router.post('/brands', asyncHandler(async (req, res) => {
  console.log('Received brand creation request');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  brandUpload(req, res, async (err) => {
    try {
      console.log('After multer upload');
      console.log('Error:', err);
      console.log('File:', req.file);
      console.log('Body after upload:', req.body);
      
      if (err) {
        console.error('Multer error:', err);
        return handleError(err, res);
      }

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'Brand image is required' });
      }

      if (!req.body.name) {
        console.error('No name provided');
        return res.status(400).json({ message: 'Brand name is required' });
      }

      // Check if brand name already exists
      const existingBrand = await Brand.findOne({ name: req.body.name });
      if (existingBrand) {
        
        return res.status(400).json({ message: 'Brand name already exists' });
      }

      // Create new brand
      const brand = new Brand({
        name: req.body.name,
        imageUrl: req.file.path,
        imagePublicId: req.file.filename
      });

      await brand.save();

      res.status(201).json({
        message: 'Brand added successfully',
        brand
      });
    } catch (error) {
      console.error('Error in brand creation:', error);
      // If there's an error, try to delete the uploaded image
      if (req.file && req.file.filename) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (deleteError) {
          console.error('Error deleting uploaded image after failed brand creation:', deleteError);
        }
      }
      handleError(error, res);
    }
  });
}));

router.delete('/brands/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return res.status(404).json({ message: 'Brand not found' });
  }

  // Delete image from Cloudinary
  if (brand.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(brand.imagePublicId);
    } catch (error) {
      console.error('Error deleting brand image:', error);
    }
  }

  await brand.deleteOne();
  res.json({ message: 'Brand deleted successfully' });
}));

router.put('/brands/:id/toggle', asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return res.status(404).json({ message: 'Brand not found' });
  }

  brand.isActive = !brand.isActive;
  await brand.save();

  res.json({
    message: `Brand ${brand.isActive ? 'activated' : 'deactivated'} successfully`,
    brand
  });
}));

module.exports = router;
