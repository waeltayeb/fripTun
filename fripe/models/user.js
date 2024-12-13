const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    city: { type: String, required: false },
    avenue: { type: String, required: false },
    postal: { type: String, required: false },
    role: { type: String, default: 'client' }
    });
    
    module.exports = mongoose.model('User', userSchema);