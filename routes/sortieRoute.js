const express = require('express');
const router = express.Router();
const {ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
    try {
        const { stockId, quantite, date } = req.body;
        const db = req.db;
        const objectId = new ObjectId(stockId)
        const produit = await db.collection('stocks').findOne({ _id : objectId });

        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé dans le stock" });
        }

        if (produit.quantiteDisponible < quantite) {
            return res.status(400).json({ message: "Stock insuffisant" });
        }

        await db.collection('stocks').updateOne(
            { _id : objectId },
            { $inc: { quantiteDisponible: -quantite } }
        );

        await db.collection('sortie').insertOne({
            stockId: objectId,
            quantite,
            date: date || new Date()
        });
        res.status(201).json({ message: "Sortie de stock enregistrée avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;