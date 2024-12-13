const mongoose = require('mongoose');

const setingsShema = new mongoose.Schema({
  imagepanner: { type: String, required: true , default:"" },
  imagepub: { type: String, required: true, unique: true, default:""  },

});

module.exports = mongoose.model('Settings', setingsShema);
/// ki uploadi ifse5 l9dima w hot jdida w tap9a b nfes isem