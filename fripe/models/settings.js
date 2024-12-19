const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  bannerUrl: { type: String, default: null },
  bannerPublicId: { type: String, default: null },
  pubUrl: { type: String, default: null },
  pubPublicId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
