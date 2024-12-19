const express = require('express');
const Chat = require('../models/Chat'); // Model for messages
const User = require('../models/user'); // Model for users
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all users with the "client" role and their last messages
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'client' });
    
    // Get last message for each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Chat.findOne({ userId: user._id })
          .sort({ timestamp: -1 })
          .select('text timestamp');
          
        return {
          ...user.toObject(),
          lastMessage: lastMessage ? {
            text: lastMessage.text,
            timestamp: lastMessage.timestamp
          } : null
        };
      })
    );
    
    res.status(200).json(usersWithLastMessage);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get last message for each user (separate endpoint)
router.get('/users/last-messages', async (req, res) => {
  try {
    // Get all clients
    const users = await User.find({ role: 'client' });
    
    // Get last message for each user using aggregation
    const lastMessages = await Chat.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$userId',
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.firstname',
          message: '$lastMessage.text',
          timestamp: '$lastMessage.timestamp',
          sender: '$lastMessage.sender'
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);

    res.status(200).json(lastMessages);
  } catch (err) {
    console.error('Error fetching last messages:', err);
    res.status(500).json({ error: 'Failed to fetch last messages' });
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
