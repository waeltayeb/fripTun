const multer = require('multer');
const path = require('path');

// Définir la destination du fichier et son nom
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nom du fichier avec timestamp
  }
});

// Appliquer la configuration
const upload = multer({ storage: storage });

module.exports = upload;
