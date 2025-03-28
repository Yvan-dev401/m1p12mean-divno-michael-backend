const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { stockId, quantite, date, nomPiece} = req.body;
        const result = await req.db.collection('stocks').insertOne(
            {
                stockId: new ObjectId(stockId),
                quantite,
                date: date || new Date(),
                nomPiece
            }
        );
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;