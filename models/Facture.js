const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
  reparationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reparation', required: true },
  montant: { type: Number, required: true },
  dateFacture: { type: Date, default: Date.now },
  statut: { type: String, enum: ['payée', 'en attente'], default: 'en attente' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', FactureSchema);