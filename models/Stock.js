const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  nomPiece: { type: String, required: true },
  quantiteDisponible: { type: Number, required: true },
  prixUnitaire: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stock', stockSchema);