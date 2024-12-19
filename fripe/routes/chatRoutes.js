const express = require('express');
const Chat = require('../models/Chat'); // Model for messages
const User = require('../models/user'); // Model for users
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all users with the "client" role
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'client' });
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get messages for a specific user
router.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save a new chat message
router.post(
  '/send',
  body('sender').notEmpty().withMessage('Sender is required'),
  body('text').notEmpty().withMessage('Message text is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sender, text, userId } = req.body;

    try {
      const newChat = new Chat({ sender, text, userId, timestamp: new Date() });
      const savedChat = await newChat.save();
      res.status(201).json(savedChat);
    } catch (err) {
      console.error('Error saving message:', err);
      res.status(500).json({ error: 'Failed to save message' });
    }
  }
);

module.exports = router;
