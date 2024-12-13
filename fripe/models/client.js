const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  avenue: { type: String, required: true },
  postal: { type: String, required: true },
  role: { type: String, default: 'client' }
  
});

module.exports = mongoose.model('Client', clientSchema);
///chat est une fonaction utiliser 
