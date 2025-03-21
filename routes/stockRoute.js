const express = require('express');
const router = express.Router();


router.post('/stock/initialize', async (req, res) => {
    try {
        const produits = req.body; 
        const db = req.db;

        const result = await db.collection('stocks').insertMany(produits);
        res.status(201).json({ message: "Stock initialisé avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/stock/:produit_id', async (req, res) => {
    try {
        const produit_id = req.params.produit_id;
        const db = req.db;

        const produit = await db.collection('stocks').findOne({ produit_id });

        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé dans le stock" });
        }

        res.status(200).json(produit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// --------------------------------------------------------------------------------------------

router.post('/', async (req, res) => {
    try {
        const result = await req.db.collection('stocks').insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const stocks = await req.db.collection('stocks').find().toArray();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('stocks').findOneAndUpdate(
            { _id: new require('mongodb').ObjectID(id) },
            { $set: req.body },
            { returnOriginal: false }
        );
        res.json(result.value);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.collection('stocks').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Stock supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;