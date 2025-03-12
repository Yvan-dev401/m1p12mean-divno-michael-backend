const express = require('express')
const router = express.Router()
const natural = require('natural');
const stemmer = natural.PorterStemmerFr;
const Keyword = require('../models/Keyword')

function normalizeText(text) {
  return text
    .toLowerCase() // Convertir en minuscules
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s]/g, '') // Supprimer les caractères spéciaux
    .replace(/(\w+)(s|x)\b/g, '$1'); // Remplacer les pluriels par le singulier
}

function calculDevis(tab) {
  let total_piece = 0;
  let total_main = 0;

  for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < tab[i].pieces.length; j++) {
      const piece = tab[i].pieces[j];
      total_piece += piece.pieceId.prixUnitaire * piece.quantite;
    }
    total_main += tab[i].mainOeuvre;
  }

  const total = total_piece + total_main;
  return total;
}

router.get('/', async (req, res) => {
  try {
    const description = "Je veux faire un vidanges, et ensuite reparer la moteurs, il y a aussi la batterie faible"
    //const description = "Je veux faire un vidanges"

    if (!description) { return res.status(400).json({ message: 'La description est requise.' }); }

    // Normaliser la description
    const normalizedDescription = normalizeText(description);

    const keywords = await Keyword.find({}, 'motCle');
    const tabMotCle = keywords.map((keyword) => keyword.motCle); // [liste ==> ["moteur", "vidange"] ]
    const tabDescription = normalizedDescription.split(" ")

    var resu = tabDescription.filter((mot) => {
      return tabMotCle.includes(mot);
    });

    const resultats = [];

    for (let i = 0; i < resu.length; i++) {
      const keyword = await Keyword.findOne({ motCle: resu[i] }).populate('pieces.pieceId');
      if (keyword) {
        resultats.push(keyword);
      }
    }

    if (!resultats) {
      return res.status(404).json({ message: 'Mot-clé non trouvé dans la base de données.' });
    }

    const total = calculDevis(resultats)

    res.status(200).json({ resultats: resultats, total_devis: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router