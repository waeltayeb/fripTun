const express = require('express');
const Article = require('../models/article');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Remplacez par votre nom de cloud Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,       // Remplacez par votre clé API Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // Remplacez par votre secret API Cloudinary
});


// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'articles', // Cloudinary folder name
    allowed_formats: ['jpeg', 'png', 'gif'], // Allowed file types
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers d'image sont autorisés."));
    }
  },
});

// Create a new article with images
router.post('/articles', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, size, gender, brand, isRecommended, isSold, price, newPrice } = req.body;

    // Validate required fields
    if (!title || !description || !size || !gender || !brand || !price) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Ensure images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Au moins une image doit être téléchargée.' });
    }

    // Get Cloudinary URLs of the uploaded images
    const imageUrls = req.files.map(file => file.path);

    // Create a new article in the database
    const article = new Article({
      title,
      description,
      images: imageUrls, // Save Cloudinary URLs
      size,
      gender,
      brand,
      isRecommended,
      isSold,
      price,
      newPrice,
      status: 'available',
    });

    // Save the article
    await article.save();

    // Respond with the created article
    res.status(201).json({
      message: 'Article ajouté avec succès!',
      article,
    });
  } catch (err) {
    console.error('Error occurred:', err);

    // Handle Multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: 'Erreur de téléchargement du fichier.',
        error: err.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      error: err.message || err,
    });
  }
});



// Lire tous les articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lire un article par ID
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modifier un article
router.put('/articles/:id', upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      size,
      gender,
      brand,
      isRecommended,
      isSold,
      price,
      newPrice,
      removeImages, // Receive removed images
    } = req.body;

    // Find the article
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Remove images from Cloudinary and database
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      for (const imageUrl of imagesToRemove) {
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(`articles/${publicId}`); // Remove from Cloudinary
        
        // Remove from article's image list
        const index = article.images.indexOf(imageUrl);
        if (index > -1) {
          article.images.splice(index, 1);
        }
      }
    }

    // Upload new images to Cloudinary (if any)
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'articles', // Cloudinary folder
        });
        newImageUrls.push(result.secure_url); // Store new image URL
      }
    }

    // Append new images to the article
    article.images.push(...newImageUrls);

    // Update other article fields
    article.title = title;
    article.description = description;
    article.size = size;
    article.gender = gender;
    article.brand = brand;
    article.isRecommended = isRecommended;
    article.isSold = isSold;
    article.price = price;
    article.newPrice = newPrice;

    // Save the updated article
    const updatedArticle = await article.save();

    res.status(200).json(updatedArticle);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


// Route to get article counts
router.get('/statsArtciles', async (req, res) => {
  try {
    // Count total articles
    const totalArticles = await Article.countDocuments();

    // Count sold articles (status: "sold")
    const soldArticles = await Article.countDocuments({ status: 'sold' });

    // Count pending articles (status: "pending")
    const pendingArticles = await Article.countDocuments({ status: 'pending' });

    // Return the counts as a JSON response
    res.status(200).json({
      totalArticles,
      soldArticles,
      pendingArticles,
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});


router.get('/ArticlesRecommended', async (req, res) => {
  try {
    const articles = await Article.find({
      isRecommended: true,
      status: 'available'  // Add condition for status being 'available'
    });
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/LastArticles', async (req, res) => {
  try {
    const lastArticles = await Article.find({
      status: 'available'  // Add condition for status being 'available'
    })
      .sort({ createdAt: -1 })  // Sort by creation date in descending order
      .limit(8);  // Limit to the last 8 articles

    res.status(200).json(lastArticles);
  } catch (error) {
    console.error('Error fetching last 8 articles:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});


router.get('/ArticlesAvailable', async (req, res) => {
  try {
    // Find all articles with status 'available'
    const availableArticles = await Article.find({ status: 'available' });

    res.status(200).json(availableArticles); // Return the articles
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
});





// Supprimer un article
router.delete('/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
