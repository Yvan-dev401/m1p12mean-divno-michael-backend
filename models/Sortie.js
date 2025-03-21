const mongoose = require('mongoose');

const sortieSchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },  
  quantite: { type: Number, required: true },
  date_sortie: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sortie', sortieSchema);