const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


/* router.get('/:repID', async (req, res) => {
    try {
        const { repID } = req.params;
        const db = req.db;

        const pieces = await db.collection('devis')
            .find({ reparationId: repID })
            .toArray();

        const stocks = await db.collection('stocks').find().toArray();

        let piecesManquantes = [];

        for (const piece of pieces) {
            const stock = stocks.find(data =>
                data._id.toString() === piece.stockId.toString()
            );

            if (stock.quantiteDisponible < piece.quantite) {
                piecesManquantes.push(stock.nomPiece || `Pièce ${stock.nomPiece}`);
            }
        }

        if (piecesManquantes.length > 0) {
            return res.status(400).json({
                error: "Pièces insuffisantes",
                piecesManquantes
            });
        }
        
        else {
            for (const piece of pieces) {

                await db.collection('stocks').updateOne(
                    { _id: new ObjectId(piece.stockId) },
                    { $inc: { quantiteDisponible: -piece.quantite } }
                );

                await db.collection('sortie').insertOne({
                    stockId: new ObjectId(piece.stockId),
                    quantite: piece.quantite,
                    date: new Date(),
                });
            }

            res.status(200).json({
                success: true,
                message: "Sortie de stock enregistrée avec succès",
                piecesTraitees: pieces.length
            });
        }



    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            success: false,
            error: "Erreur serveur",
            details: error.message
        });
    }
}); */

router.get('/:repID', async (req, res) => {
    try {
        const { repID } = req.params;
        const db = req.db;

        const pieces = await db.collection('devis')
            .find({ reparationId: repID })
            .toArray();

        for (const piece of pieces) {
            await db.collection('stocks').updateOne(
                { _id: new ObjectId(piece.stockId) },
                { $inc: { quantiteDisponible: - piece.quantite } }
            );

            await db.collection('sortie').insertOne({
                stockId: new ObjectId(piece.stockId),
                quantite: piece.quantite,
                date: new Date(),
            });
        }

        // Mise à jour de l'état de la réparation
        await db.collection('reparations').updateOne(
            { _id: new ObjectId(repID) },
            { $set: { etat: "terminé" } }
        );

        res.status(200).json({
            success: true,
            message: "Sortie de stock enregistrée avec succès et réparation terminée",
            piecesTraitees: pieces.length
        });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            success: false,
            error: "Erreur serveur",
            details: error.message
        });
    }
});

// router.get('/:repID', async (req, res) => {
//     try {
//         const { repID } = req.params;
//         const db = req.db;
//         const pieces = await db.collection('devis').find({ reparationId: repID }).toArray();
//         const allStock = await db.collection('stocks').find().toArray();
//         var pieceNonDispo = "";

//         for (let i = 0; i < pieces.length; i++) {
//             for (let j = 0; j < allStock.length; j++) {
//                 if (pieces[i].stockId == allStock[j]._id) {
//                     if (allStock[j].quantiteDisponible - pieces[i].quantite < 0) {
//                         pieceNonDispo += `${allStock[j].nomPiece}, `
//                     }

//                 }
//             }
//         }

//         if (pieceNonDispo) {
//             res.status(201).json(pieceNonDispo);
//         }
//         else {
//             for (let i = 0; i < pieces.length; i++) {

//                 await db.collection('stocks').updateOne(
//                     { _id: new ObjectId(pieces[i]._id) },
//                     { $inc: { quantiteDisponible: - pieces[i].quantite } }
//                 );

//                 await db.collection('sortie').insertOne({
//                     stockId: new ObjectId(pieces[i].stockId),
//                     quantite: pieces[i].quantite,
//                     date: date || new Date()
//                 });
//             }
//             res.status(201).json({ message: "Sortie de stock enregistrée avec succès" });
//         }


//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//         const { stockId, quantite, date } = req.body;
//         const db = req.db;
//         const objectId = new ObjectId(stockId)
//         const produit = await db.collection('stocks').findOne({ _id : objectId });

//         if (!produit) {
//             return res.status(404).json({ message: "Produit non trouvé dans le stock" });
//         }

//         if (produit.quantiteDisponible < quantite) {
//             return res.status(400).json({ message: "Stock insuffisant" });
//         }

//         await db.collection('stocks').updateOne(
//             { _id : objectId },
//             { $inc: { quantiteDisponible: -quantite } }
//         );

//         await db.collection('sortie').insertOne({
//             stockId: objectId,
//             quantite,
//             date: date || new Date()
//         });
//         res.status(201).json({ message: "Sortie de stock enregistrée avec succès" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

module.exports = router;