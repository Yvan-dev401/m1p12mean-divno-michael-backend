const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/productivite/:idMecanicien', async (req, res) => {
    try {
        const { idMecanicien } = req.params;
        const db = req.db;
        const collection = db.collection('reparations'); // À adapter selon votre nom de collection

        // Pipeline pour compter les réparations où le mécanicien est intervenu
        const pipeline = [
            {
                $match: {
                    mecanicienId: idMecanicien,
                    mecanicienId: { $ne: "" } // Exclut les réparations sans mécanicien
                }
            },
            {
                $count: "productivite"
            }
        ];

        const result = await collection.aggregate(pipeline).toArray();
        
        const productivite = result.length > 0 ? result[0].productivite : 0;

        res.status(200).json({
            idMecanicien: idMecanicien,
            productivite: productivite,
            message: `Productivité calculée pour le mécanicien ${idMecanicien}`
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Erreur lors du calcul de la productivité',
            error: error.message
        });
    }
});

router.get('/stat', async (req, res) => {
    try {
        const db = req.db;
        const collection = db.collection('reparations');

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
        res.status(200).json(
            stats);

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:annee?', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const db = req.db;
        const result = await db.collection('paiement').insertOne(data);
        res.status(201).json({ message: "Paiement ajouté avec succès", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;