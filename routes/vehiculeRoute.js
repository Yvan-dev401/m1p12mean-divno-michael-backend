const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { marque, modele, annee, plaqueImmatriculation } = req.body;
        const clientId = req.query.user;

        const vehic = { clientId, marque, modele, annee, plaqueImmatriculation };
        const result = await req.db.collection('vehicules').insertOne(vehic);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const vehic = await req.db.collection('vehicules').find().toArray();
        res.json(vehic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('vehicules').findOneAndUpdate(
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
        await req.db.collection('vehicules').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Vehicle supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;