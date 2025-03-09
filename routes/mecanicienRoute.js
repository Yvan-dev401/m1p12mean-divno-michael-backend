const express = require('express')
const router = express.Router()
const Mecanicien = require('../models/Mecanicien')
const {LoginMecanicien, Login} = require('../controller/Auth')

router.post('/login', LoginMecanicien);

router.post('/', async (req, res) => {
    try {
        const mecanicien = new Mecanicien(req.body)
        await mecanicien.save();
        res.status(201).json(mecanicien);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const mecanicien = await Mecanicien.find();
        res.json(mecanicien);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const mecanicien = await Mecanicien.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(mecanicien);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Mecanicien.findByIdAndDelete(req.params.id);
        res.json({ message: "Mecanicien supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;