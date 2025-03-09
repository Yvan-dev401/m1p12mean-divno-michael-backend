const express = require('express')
const router = express.Router()
const Manager = require('../models/Manager')
const { LoginManager } = require('../controller/Auth')

router.post('/login', LoginManager);

router.post('/', async (req, res) => {
    try {
        const manager = new Manager(req.body)
        await manager.save();
        res.status(201).json(manager);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const manager = await Manager.find();
        res.json(manager);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const manager = await Manager.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(manager);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Manager.findByIdAndDelete(req.params.id);
        res.json({ message: "Manager supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;