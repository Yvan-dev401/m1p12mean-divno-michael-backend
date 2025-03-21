const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({
  reparationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reparation', required: true },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  etat: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Devis', DevisSchema);