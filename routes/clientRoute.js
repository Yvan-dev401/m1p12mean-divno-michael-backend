const express = require('express')
const router = express.Router()
const Client = require('../models/Client')
const {Login} = require('../controller/Auth')

router.post('/login', Login);

router.post('/', async (req, res) => {
    //const {username, password, nom_prenom, telephone, email} = req.body
    try {
        const client = new Client(req.body)
        await client.save();
        res.status(201).json(client);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const client = await Client.find();
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(client);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: "Client supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;