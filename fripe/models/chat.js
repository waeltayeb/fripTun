// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const { io } = require('../server'); // Assurez-vous que socket.io est exporté du fichier server.js

// Route pour envoyer un message
router.post('/', async (req, res) => {
  const { senderId, receiverId, message, senderType, receiverType } = req.body;
  const conversationId = `${senderId}-${receiverId}`;

  try {
    // Enregistrer le message dans la base de données
    const newMessage = new Chat({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      senderModel: senderType,
      receiverModel: receiverType,
      message,
    });

    await newMessage.save();

    // Envoyer le message en temps réel avec Socket.io
    if (io.sockets.sockets[receiverId]) {
      io.sockets.sockets[receiverId].emit('newMessage', { senderId, message });
    }

    res.status(200).json({ message: 'Message envoyé avec succès', chat: newMessage });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'envoi du message', error });
  }
});

// Route pour récupérer toutes les conversations d'un utilisateur
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender receiver', 'name email')
      .sort({ timestamp: 1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

module.exports = router;
