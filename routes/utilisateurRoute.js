const express = require('express')
const router = express.Router()
const {Log} = require('../controller/Auth');
const Utilisateur = require('../models/Utilisateur');

router.post('/login', Log);

router.post('/', async (req, res) => {
    //const {username, password, nom_prenom, telephone, email} = req.body
    try {
        const user = new Utilisateur(req.body)
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await Utilisateur.find();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await Utilisateur.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Utilisateur.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;