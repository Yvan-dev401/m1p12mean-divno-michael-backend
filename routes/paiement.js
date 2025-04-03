const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const db = req.db;
        const result = await db.collection('paiement').insertOne(data);
        res.status(201).json({ message: "Paiement ajouté avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;