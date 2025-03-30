const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { idStock, orderQuantite, date, nomPiece, etat } = req.body;
        const result = await req.db.collection("commande").insertOne({
          idStock: idStock,
          orderQuantite,
          date: date || new Date(),
          nomPiece,
          etat: etat || "En attente",
        });
        res.status(201).json({ message: "Commande avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const commandes = await req.db.collection('commande').find().toArray();
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;