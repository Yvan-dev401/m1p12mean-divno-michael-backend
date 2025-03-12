const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  motCle: { type: String, required: true, unique: true }, // Le mot-clé (ex: "moteur")
  pieces: [
    {
      pieceId: { type: mongoose.Schema.Types.ObjectId, ref:"Stock", require:true}, // Référence à la pièce
      quantite: { type: Number, required: true }, // Quantité nécessaire
    },
  ],
  mainOeuvre: { type: Number, required: true }, // Coût de la main d'œuvre
  createdAt: { type: Date, default: Date.now }, // Date de création
});

module.exports = mongoose.model('Keyword', keywordSchema);