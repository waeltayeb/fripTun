// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const mongoose = require('mongoose');
const io = require('../server'); // Assurez-vous que io est bien exporté depuis server.js

// 1. Envoyer un message
router.post('/chat', async (req, res) => {
  const { senderId, receiverId, message, senderModel, receiverModel, conversationId } = req.body;

  try {
    // Trouver l'expéditeur et le destinataire
    const sender = await mongoose.model(senderModel).findById(senderId);
    const receiver = await mongoose.model(receiverModel).findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Expéditeur ou destinataire non trouvé" });
    }

    // Créer le nouveau message
    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message,
      senderModel,
      receiverModel,
      conversationId
    });

    // Sauvegarder le message dans la base de données
    await newMessage.save();

    // Vérifier si la socket du destinataire est disponible
    const receiverSocket = io.sockets.sockets.get(receiverId);
    if (receiverSocket) {
      // Envoyer le message en temps réel via Socket.io
      receiverSocket.emit('newMessage', { senderId, message });
    } else {
      console.log(`Socket du destinataire ${receiverId} non trouvée`);
    }

    res.status(201).json({ message: 'Message envoyé avec succès', chat: newMessage });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erreur lors de l\'envoi du message', error: err.message });
  }
});

// 2. Récupérer tous les messages d'une conversation
router.get('/chat/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Chat.find({ conversationId })
      .populate('sender receiver', 'name email role') // Modifiez les champs selon votre modèle
      .sort({ timestamp: 1 }); // Trier les messages par date croissante

    if (!messages.length) {
      return res.status(404).json({ message: 'Aucun message trouvé pour cette conversation' });
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la récupération des messages', error: err.message });
  }
});

// 3. Récupérer toutes les conversations d'un utilisateur
router.get('/chat/conversations/:userId/:userRole', async (req, res) => {
  const { userId, userRole } = req.params;

  try {
    const conversations = await Chat.find({
      $or: [
        { sender: userId, senderModel: userRole },
        { receiver: userId, receiverModel: userRole }
      ]
    })
      .populate('sender receiver', 'name email role') // Modifiez les champs selon votre modèle
      .distinct('conversationId'); // Récupérer toutes les conversations uniques

    res.status(200).json(conversations);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la récupération des conversations', error: err.message });
  }
});

// 4. Supprimer un message spécifique
router.delete('/chat/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Chat.findByIdAndDelete(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la suppression du message', error: err.message });
  }
});

module.exports = router;
