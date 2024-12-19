const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // "admin" or "user"
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
