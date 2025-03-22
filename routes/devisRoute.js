const express = require('express');
const router = express.Router();
const {ObjectId} = require('mongodb');
const {getDevis} = require('../controller/DevisController')

router.post('/', async (req, res) => {
    try {
        const produits = req.body; 
        const db = req.db;

        const result = await db.collection('devis').insertMany(produits);
        res.status(201).json({ message: "Stock initialisé avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/devisByReparationID', async (req, res) => {
    try {
        const devisCollection = req.db.collection('devis');

        const devis_stock = await devisCollection.aggregate([
            {
                $addFields: {
                    stockIdObjectId: { $toObjectId: "$stockId" } 
                }
            },
            {
                $lookup: {
                    from: 'stocks',
                    localField: 'stockIdObjectId', 
                    foreignField: '_id',
                    as: 'stockDetails'
                }
            },
            {
                $unwind: '$stockDetails'
            },
            {
                $project: {
                    _id: 1,
                    reparationId: 1,
                    nomPiece: '$stockDetails.nomPiece',
                    etat: 1,
                    prixUnitaire: '$stockDetails.prixUnitaire',
                    main_d_oeuvre: '$stockDetails.main_d_oeuvre'
                }
            }
        ]).toArray();

        console.log(devis_stock)

        res.json({'details':devis_stock, 'total':getDevis(devis_stock)});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('devis').findOneAndUpdate(
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
        await req.db.collection('devis').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Devis supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.delete('/', async (req, res) => {
//     try {
//         const { ids } = req.body;
//         const db = req.db;

//         const objectIds = ids.map(id => new ObjectId(id));

//         const result = await db.collection('devis').deleteMany({ _id: { $in: objectIds } });

//         res.status(200).json({ message: `${result.deletedCount} documents supprimés avec succès`, result });
//     } catch (error) {

//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;