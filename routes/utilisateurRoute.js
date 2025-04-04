const express = require('express')
const router = express.Router()
const {Log, Logout} = require('../controller/Auth');
const bcrypt = require("bcryptjs");
// const express = require('express');

router.post('/login', Log);

router.get('/logout', Logout);

// router.get('/:id', async (req, res) => {
//     try {
//         const user = await Utilisateur.findById(req.params.id);
//         res.json(user);
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

/* router.post('/', async (req, res) => {
    try {
        const result = await req.db.collection('utilisateurs').insertOne(req.body);
        const insertedUser = await req.db.collection('utilisateurs').findOne({ _id: result.insertedId });
        res.status(201).json(insertedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}); */

router.get('/', async (req, res) => {
    try {
        const users = await req.db.collection('utilisateurs').find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const db = req.db;

    // Hachage du mot de passe
    if (user.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }

    const result = await db.collection("utilisateurs").insertOne(user);
    res
      .status(201)
      .json({ message: "Utilisateurs inscrit avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('utilisateurs').findOneAndUpdate(
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
        await req.db.collection('utilisateurs').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;