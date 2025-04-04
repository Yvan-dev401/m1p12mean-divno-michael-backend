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
        const vehic = await req.db.collection('vehicules').find().toArray();
        const data = vehic.map(vehicle => ({
            label: `${vehicle.marque} | ${vehicle.modele}`,
            value: vehicle._id.toString()
        }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);
        const result = await req.db.collection('vehicules').findOneAndUpdate(
            { _id: objectId },
            { $set: req.body }
        );
        res.json(result.value);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);
        const counRep = await req.db.collection('reparations').countDocuments({ vehiculeId: id });
        console.log(counRep)
        if (counRep > 0 ) {
            return res.status(400).json({ 
                message: "no" 
            });
        }
        const result = await req.db.collection('vehicules').deleteOne({ _id: objectId });
        res.json({ message: "Véhicule supprimé avec succès" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;