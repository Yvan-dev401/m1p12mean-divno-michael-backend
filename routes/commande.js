const express = require('express');
const {ObjectId} = require('mongodb');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { idStock, orderQuantite, date, nomPiece, etat } = req.body;
        const result = await req.db.collection("commande").insertOne({
          idStock: idStock,
          orderQuantite,
          date: date || new Date(),
          nomPiece,
          etat: etat || "En attente",
        });
        res.status(201).json({ message: "Commande avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const commandes = await req.db.collection('commande').find().toArray();
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const commandeId = req.params.id;
        const { etat } = req.body;

        if (!etat) {
            return res.status(400).json({ message: 'Le champ "etat" est requis' });
        }

        const commande = await req.db.collection('commande').findOne({ _id: new ObjectId(commandeId) });

        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        const result = await req.db.collection('commande').updateOne(
            { _id: new ObjectId(commandeId) },
            { $set: { etat } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Si l'état est modifié en "Livré", ajouter la quantité commandée à la quantité disponible dans la collection stocks
        if (etat === 'Livré') { // Mise à jour uniquement si l'état est "Livré"
            const { idStock, orderQuantite } = commande;

            await req.db.collection('stocks').updateOne(
                { _id: new ObjectId(idStock) },
                { $inc: { quantiteDisponible: orderQuantite } } // Ajouter la quantité commandée à la quantité disponible
            );
        }

        res.json({ message: 'État de la commande mis à jour avec succès' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;