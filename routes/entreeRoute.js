const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // const {new} = req.body;

        const { stockId, quantite, date, nomPiece, pu, mo } = req.body;
        const db = req.db;
        const objectId = new ObjectId(stockId);

        const produit = await db.collection('stocks').findOne({ _id : objectId });

        if (produit) {
            await db.collection('stocks').updateOne(
                { _id : objectId },
                { $inc: { quantiteDisponible: quantite } }
            );
        } else {
            await db.collection('stocks').insertOne({
                nomPiece : nomPiece,
                quantiteDisponible: quantite,
                prixUnitaire : pu,
                main_d_oeuvre : mo
            });
        }

        await db.collection('entree').insertOne({
            stockId: objectId,
            quantite,
            date: date || new Date()
        });

        res.status(201).json({messae : "update avec succ"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;