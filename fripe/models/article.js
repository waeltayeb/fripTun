const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  size: { type: String, required: true },
  gender: { type: String, required: true },
  brand: { type: String, required: true },
  isRecommended: { type: Boolean, required: false },
  isSold: { type: Boolean, required: false },
  price: { type: Number, required: true },
  newPrice: { type: Number, required: false },
  status: { type: String, default: 'available' }
});

module.exports = mongoose.model('Article', articleSchema);
