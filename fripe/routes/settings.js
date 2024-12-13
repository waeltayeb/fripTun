const express = require('express');
const fs = require('fs');
const path = require('path');
const Settings = require('../models/settings');
const upload = require('../config/upload');  // Importer le middleware multer

const router = express.Router();

// Route pour mettre à jour les images
router.put('/settings', upload.fields([{ name: 'imagepanner', maxCount: 1 }, { name: 'imagepub', maxCount: 1 }]), async (req, res) => {
  try {
    let settings = await Settings.findOne();  // Récupérer l'objet settings actuel

    // Si aucun paramètre n'est trouvé, créer un nouvel enregistrement
    if (!settings) {
      settings = new Settings({
        imagepanner: '',
        imagepub: '',
      });
    }

    // Si le fichier imagepanner est téléchargé, mettre à jour l'image
    if (req.files && req.files.imagepanner && req.files.imagepanner[0]) {
      // Supprimer l'ancienne imagepanner si elle existe
      if (settings.imagepanner) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', settings.imagepanner);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Supprimer l'ancienne image
        }
      }
      // Enregistrer le nouveau fichier imagepanner
      settings.imagepanner = req.files.imagepanner[0].filename;
    }

    // Si le fichier imagepub est téléchargé, mettre à jour l'image
    if (req.files && req.files.imagepub && req.files.imagepub[0]) {
      // Supprimer l'ancienne imagepub si elle existe
      if (settings.imagepub) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', settings.imagepub);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Supprimer l'ancienne image
        }
      }
      // Enregistrer le nouveau fichier imagepub
      settings.imagepub = req.files.imagepub[0].filename;
    }

    // Sauvegarder les modifications dans la base de données
    await settings.save();
    res.status(200).json({ message: 'Settings mis à jour avec succès', settings });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.find();

    if (settings.length === 0) {
      return res.status(404).json({ message: 'Aucune settings trouvée' });
    }

    // Préparer des URLs complètes pour les images
    const settingsWithUrls = settings.map(setting => ({
      ...setting._doc,  // Conserver les autres propriétés du setting
      imagepanner: `${req.protocol}://${req.get('host')}/uploads/${setting.imagepanner}`,
      imagepub: `${req.protocol}://${req.get('host')}/uploads/${setting.imagepub}`
    }));

    res.status(200).json({ settings: settingsWithUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;
