const express = require('express');
const router = express.Router();

router.get('/repByClientID', async (req, res) => {
    try {
        const clientId = req.query.user;
        const vehicules = await req.db.collection('vehicules').find({ clientId }).toArray();
        const vehiculeIds = vehicules.map((v) => v._id);

        const reparations = await req.db.collection('reparations').find({ vehiculeId: { $in: vehiculeIds } }).toArray();
        res.status(200).json(reparations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accéder directement au document inséré en utilisant result.insertedId pour obtenir l'ID du document inséré et ensuite récupérer le document complet si nécessaire.
router.post('/', async (req, res) => {
    try {
        const result = await req.db.collection('reparations').insertOne(req.body);
        const insertedReparation = await req.db.collection('reparations').findOne({ _id: result.insertedId });
        res.status(201).json(insertedReparation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reparations = await req.db.collection('reparations').find().toArray();
        res.json(reparations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('reparations').findOneAndUpdate(
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
        await req.db.collection('reparations').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Reparation supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;