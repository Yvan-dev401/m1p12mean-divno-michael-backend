const mongoose = require('mongoose');

const entreSchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },  
  quantite: { type: Number, required: true },
  date_entree: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('entree', entreSchema);