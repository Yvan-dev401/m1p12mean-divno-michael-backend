const express = require('express');
const router = express.Router();
const {ObjectId} = require('mongodb');

router.get('/repByClientID', async (req, res) => {
    try {
        const clientId = req.query.user;
        const vehicules = await req.db.collection('vehicules').find({ clientId }).toArray();
        const vehiculeIds = vehicules.map((v) => v._id);

        const reparations = await req.db.collection('reparations').find({ vehiculeId: { $in: vehiculeIds } }).toArray();
        res.status(200).json(reparations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accéder directement au document inséré en utilisant result.insertedId pour obtenir l'ID du document inséré et ensuite récupérer le document complet si nécessaire.
router.post('/', async (req, res) => {
    try {
        const result = await req.db.collection('reparations').insertOne(req.body);
        const insertedReparation = await req.db.collection('reparations').findOne({ _id: result.insertedId });
        res.status(201).json(insertedReparation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/historique', async (req, res) => {
    try {
        const reparations = await req.db.collection('reparations').find({etat: "terminer"}).toArray();
        res.json(reparations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:etat', async (req, res) => {
    try {
        const {etat} = req.params
        const reparations = await req.db.collection('reparations').find({etat: etat}).toArray();
        res.json(reparations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.get('/', async (req, res) => {
//     try {
//         const reparations = await req.db.collection('reparations').find().toArray();
//         res.json(reparations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });




router.get('/', async (req, res) => {
    try {
        const repaColl = req.db.collection('reparations');
        const reparations = await repaColl.aggregate([
            {
                $addFields: {
                    vehiId: {
                        $cond: {
                            if: { $and: [{ $ne: ["$vehiculeId", null] }, { $ne: ["$vehiculeId", ""] }] },
                            then: { $toObjectId: "$vehiculeId" },
                            else: null
                        }
                    },
                    mecaId: {
                        $cond: {
                            if: { $and: [{ $ne: ["$mecanicienId", null] }, { $ne: ["$mecanicienId", ""] }] },
                            then: { $toObjectId: "$mecanicienId" },
                            else: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'vehicules',
                    localField: 'vehiId',
                    foreignField: '_id',
                    as: 'detVehicules'
                }
            },
            {
                $lookup: {
                    from: 'utilisateurs',
                    localField: 'mecaId',
                    foreignField: '_id',
                    as: 'detMecanicien'
                }
            },
            {
                $unwind: {
                    path: '$detVehicules',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$detMecanicien',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    notesTechniques: 1,
                    coutFinal: 1,
                    dateFin: 1,
                    dateDebut: 1,
                    etat: 1,
                    descriptionProbleme: 1,
                    nom: '$detMecanicien.nom',
                    marque: '$detVehicules.marque',
                    modele: '$detVehicules.modele',
                }
            }
        ]).toArray();
        // Envoyer la réponse au client
        res.json(reparations);
    } catch (error) {
        // Gestion des erreurs
        console.error('Erreur lors de la récupération des réparations:', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des données.' });
    }
});

// router.put('/:id/:etat', async(req, res) => {
//     try{
//         const {id, etat} = req.params;
//         const result = await req.db.collection('reparations').findOneAndUpdate(
//             {_id: new ObjectId(id)},
//             {$set: etat},
//             {returnOriginal: false}
//         )
//         res.json(result.value)   aa
//     }
//     catch(error){
//         res.status(400).json({ message: error.message });
//     }
// })

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.collection('reparations').findOneAndUpdate(
            { _id: new ObjectId(id) },
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
        await req.db.collection('reparations').deleteOne({ _id: new require('mongodb').ObjectID(id) });
        res.json({ message: "Reparation supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;