const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
        const { stockId, quantite, date, nomPiece} = req.body;
        const result = await req.db.collection('commande').insertOne(
            {
                stockId: new ObjectId(stockId),
                quantite,
                date: date || new Date(),
                nomPiece
            }
        );
        res.status(201).json(result.ops[0]);
=======
=======
>>>>>>> e9b7168bfe81c4f3a21e97b6f3f4da4b6b398c7a
        const { idStock, orderQuantite, date, nomPiece, etat } = req.body;
        const result = await req.db.collection("commande").insertOne({
          idStock: idStock,
          orderQuantite,
          date: date || new Date(),
          nomPiece,
          etat: etat || "En attente",
        });
        res.status(201).json({ message: "Commande avec succès", result });
<<<<<<< HEAD
>>>>>>> e9b7168bfe81c4f3a21e97b6f3f4da4b6b398c7a
=======
>>>>>>> e9b7168bfe81c4f3a21e97b6f3f4da4b6b398c7a
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