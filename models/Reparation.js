const mongoose = require('mongoose');

const reparationSchema = new mongoose.Schema({
  vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  descriptionProbleme: { type: String, required: true },
  etat: { type: String, enum: ['en attente', 'en cours', 'terminé'], default: 'en attente' },
  mecanicienId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  coutFinal: { type: Number },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  notesTechniques: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reparation', reparationSchema);