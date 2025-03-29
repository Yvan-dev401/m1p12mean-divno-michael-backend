const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // const {new} = req.body;

        const { stockId, quantite } = req.body;
        const db = req.db;
        const objectId = new ObjectId(stockId);

        const produit = await db.collection('stocks').findOne({ _id : objectId });

        if (produit) {
            await db.collection('stocks').updateOne(
                { _id : objectId },
                { $inc: { quantiteDisponible: quantite } }
            );
        }
        res.status(201).json({messae : "update avec succ"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;