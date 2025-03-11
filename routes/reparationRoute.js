const express = require('express')
const router = express.Router()
const Reparation = require('../models/Reparation');
const Vehicule = require('../models/Vehicule')

router.get('/repByClientID', async (req, res) => {
    try{
        const clientId = req.query.user;
        const vehicule = await Vehicule.find({ clientId });
        const vehiculeId = vehicule.map((v) => v._id);
    
        const repa = await Reparation.find({ vehiculeId: { $in: vehiculeId } });
        res.status(200).json(repa);
    }

    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    //const {username, password, nom_prenom, telephone, email} = req.body
    try {
        const rep = new Reparation(req.body)
        await rep.save();
        res.status(201).json(rep);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const rep = await Reparation.find();
        res.json(rep);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const rep = await Reparation.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(rep);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Reparation.findByIdAndDelete(req.params.id);
        res.json({ message: "Reparation supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;