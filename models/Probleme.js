// models/Problem.js
const mongoose = require('mongoose');

// Définir le schéma pour les problèmes
const problemeSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        unique: true, // Assure que chaque mot-clé est unique
    },
    synonyms: {
        type: [String], // Tableau de chaînes de caractères
        default: [], // Valeur par défaut : tableau vide
    },
    diagnosis: {
        type: String,
        required: true,
    },
    specialite: {
        type: String, // Spécialité requise pour résoudre ce problème
        required: true,
    },
    estimatedCost: {
        type: Number,
        required: true,
    },
});

// Créer le modèle à partir du schéma
const Problem = mongoose.model('Probleme', problemeSchema);

module.exports = Problem;