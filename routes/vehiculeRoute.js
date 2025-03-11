const express = require('express')
const router = express.Router()
const Vehicle = require('../models/Vehicule')


router.post('/', async (req, res) => {
    try {
        const { marque, modele, annee, plaqueImmatriculation } = req.body;
        const clientId = req.query.user;

        const vehic = new Vehicle({ clientId, marque, modele, annee, plaqueImmatriculation });
        await vehic.save();
        res.status(201).json(vehic);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const vehic = await Vehicle.find();
        res.json(vehic);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const vehic = await Vehicle.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(vehic);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehicle supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;