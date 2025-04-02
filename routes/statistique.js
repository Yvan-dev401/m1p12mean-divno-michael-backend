const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/productivite', async (req, res) => {
    try {
        const db = req.db;
        const reparationsCollection = db.collection('reparations');
        const totalReparations = await reparationsCollection.countDocuments();

        const pipeline = [
            {
                $match: {
                    mecanicienId: { $ne: "" } 
                }
            },
            {
                $lookup: {
                    from: "utilisateurs",
                    let: { mecanoId: { $toObjectId: "$mecanicienId" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$mecanoId"] }
                            }
                        }
                    ],
                    as: "mecanicienInfo"
                }
            },
            {
                $unwind: {
                    path: "$mecanicienInfo",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $group: {
                    _id: "$mecanicienId",
                    count: { $sum: 1 },
                    nom: { $first: "$mecanicienInfo.nom" },
                }
            },
            {
                $project: {
                    mecanicienId: "$_id",
                    nom: 1,
                    productivite: "$count",
                    _id: 0
                }
            }
        ];

        const result = await reparationsCollection.aggregate(pipeline).toArray();

        res.status(200).json({
            totalReparations: totalReparations,
            mecaniciens: result
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Erreur lors du calcul de la productivité',
            error: error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('reparations');

        // Définir les états possibles
        const defaultEtats = ["pret", "en attente", "en cours", "terminé", "annulé"];

        const pipeline = [
            {
                $group: {
                    _id: "$etat",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    etat: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];

        const stats = await collection.aggregate(pipeline).toArray();
        
        // Créer un objet pour faciliter la recherche
        const statsMap = {};
        stats.forEach(item => {
            statsMap[item.etat] = item.count;
        });

        // Construire le résultat final avec tous les états
        const result = defaultEtats.map(etat => ({
            etat: etat,
            count: statsMap[etat] || 0
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/recette/:annee', async (req, res) => {
    try {
        const { annee } = req.params;
        const db = req.db;
        const collection = db.collection('paiement');
        const pipeline = [
            {
                $addFields: {
                    convertedDate: {
                        $cond: [
                            { $eq: [{ $type: "$date" }, "string"] },
                            { $dateFromString: { 
                                dateString: "$date",
                                format: "%Y-%m-%dT%H:%M:%S.%LZ"
                            }},
                            "$date"
                        ]
                    }
                }
            },
            {
                $addFields: {
                    year: { $year: "$convertedDate" },
                    month: { $month: "$convertedDate" }
                }
            },
            {
                $match: {
                    year: annee ? parseInt(annee) : { $exists: true }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$montant" }
                }
            }
        ];

        const result = await collection.aggregate(pipeline).toArray();

        const mois = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 
                     'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
        
        const reponse = {};
        mois.forEach((m, index) => {
            reponse[m] = 0;
        });

        result.forEach(item => {
            reponse[mois[item._id - 1]] = item.total;
        });

        res.status(200).json(reponse);

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Erreur lors du calcul des montants par mois',
            error: error.message,
            details: "Assurez-vous que le champ 'date' est soit un objet Date valide soit une chaîne au format ISO 8601"
        });
    }
});

module.exports = router;