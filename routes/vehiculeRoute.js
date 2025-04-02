const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
    try {
        const { id,marque, modele, annee, plaqueImmatriculation,kilometrage } = req.body;
        const clientId = new ObjectId(id)
        const createAt = new Date()
        const vehic = { clientId, marque, modele, annee, plaqueImmatriculation,kilometrage,createAt };
        const result = await req.db.collection('vehicules').insertOne(vehic);
        res.status(201).json(result);
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


router.get('/vehi', async (req, res) => {
    try {
        const data = []
        const vehic = await req.db.collection('vehicules').find().toArray();
        for(let i=0;i<vehic.length; i++){
            data.label = vehic[i].marque,
            data.value = vehic[i]._id
        }
        res.json(data)
    } catch (data) {
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
        //console.log(req.body)
        res.json(result.value);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        await req.db.collection('vehicules').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Vehicle supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;