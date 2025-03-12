const express = require('express')
const router = express.Router()
const Stock = require('../models/Stock');

router.post('/', async (req, res) => {
    try {
        const st = new Stock(req.body)
        await st.save();
        res.status(201).json(st);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const st = await Stock.find();
        res.json(st);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const st = await Stock.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(st);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.json({ message: "Stock supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

module.exports = router;