const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

// Créer un client
const SECRET_KEY = process.env.SECRET_KEY; // Remplacez par une clé secrète sécurisée

// **Route pour enregistrer un client`
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, phone, city, avenue, postal } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouveau client
    const user = new User({ firstname, lastname, email, password: hashedPassword, phone, city, avenue, postal });
    await user.save();

    res.status(201).json({ message: 'User enregistré avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Route pour la connexion**
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si le client existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User non trouvé." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un Token JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Connexion réussie.', token, role: user.role , identifier: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
