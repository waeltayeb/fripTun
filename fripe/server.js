const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const clientRoutes = require('./routes/clientRoutes');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const articleRoutes = require('./routes/articleRoutes');
const orderArticleRoutes = require('./routes/orderArticleRoutes');
const settingsRoutes = require('./routes/settings');
const paymentRoutes = require('./routes/payment');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Enable CORS for all routes
app.use(cors());

//////////////////////////
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

module.exports.io = io;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/boutique', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Connexion Socket.io
let users = {};

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté: ' + socket.id);

  // Enregistrer un utilisateur
  socket.on('register', (userId, userType) => {
    users[userId] = socket.id;
    console.log(`Utilisateur ${userId} de type ${userType} connecté`);
  });

  // Déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté: ' + socket.id);
  });
});

// Routes
app.use('/api', chatRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/user', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', articleRoutes);
app.use('/api', settingsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', orderArticleRoutes);
app.use('/api', paymentRoutes);

// Servir les fichiers statiques (les images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
