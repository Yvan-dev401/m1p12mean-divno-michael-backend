const express = require('express')
const router = express.Router()
const Probleme = require('../models/Probleme')
const User = require('../models/Utilisateur')


async function identifierProblemes(description) {
    const lowerCaseDescription = description.toLowerCase();
    const problems = await Probleme.find({});
    const identifiedProblems = [];

    for (const problem of problems) {
        if (
            lowerCaseDescription.includes(problem.keyword) ||
            (problem.synonyms || []).some(synonym => lowerCaseDescription.includes(synonym))
        ) {
            identifiedProblems.push(problem.specialite); // Ajouter la spécialité requise
        }
    }

    return identifiedProblems;
}

async function calculerScoresMecaniciens(specialitesRequises) {
    const mecaniciens = await User.find({ role : "mécanicien" });

    for (const mecanicien of mecaniciens) {
        mecanicien.score = 0; // Réinitialiser le score
        // console.log(mecanicien.specialite)
        for (const specialite of specialitesRequises) {
            if (mecanicien.specialite.some(s => s === specialite)) {
                mecanicien.score += 1; // Augmenter le score si une correspondance est trouvée
            }
        }
    }


    return mecaniciens;
}

function calculerProbabilites(mecaniciens) {
    const totalScore = mecaniciens.reduce((sum, mecanicien) => sum + mecanicien.score, 0);

    // Calculer la probabilité pour chaque mécanicien
    for (const mecanicien of mecaniciens) {
        mecanicien.probabilite = totalScore > 0 ? mecanicien.score / totalScore : 0;
    }

    return mecaniciens;
}

function assignerDemande(mecaniciens) {
    // Trier les mécaniciens par probabilité décroissante
    mecaniciens.sort((a, b) => b.probabilite - a.probabilite);

    // Assigner la demande au mécanicien avec la probabilité la plus élevée
    return mecaniciens[0];
}

router.get('/demande-devis', async (req, res) => {
    // const { clientId, description } = req.body;

    const clientId = "Michael";
    const description = "Ma voiture fait un bruit quand je freine, et la climatisation ne fonctionne pas, de plus, le moteur chauffe."

    // Identifier les problèmes dans la description
    const specialitesRequises = await identifierProblemes(description);

    if (specialitesRequises.length === 0) {
        return res.status(400).json({ message: "Aucun problème identifié dans la description." });
    }

    // console.log("sp",specialitesRequises)

    // Calculer les scores des mécaniciens
    const mecaniciens = await calculerScoresMecaniciens(specialitesRequises);
    // console.log(mecaniciens)


    // Créer une nouvelle demande
    // const nouvelleDemande = new Demande({
    //     client: clientId,
    //     description: description,
    //     assignedTo: mecanicienAssigné._id,
    //     status: "Assignée",
    // });

    // await nouvelleDemande.save();

    // Notifier le mécanicien
    // notifierMecanicien(mecanicienAssigné, nouvelleDemande);

    res.status(201).json({
        message: "Demande soumise avec succès.",
        mecaniciens: mecaniciens
    });
});

// async function analyseProblemes(description) {
//     const lowerCaseDescription = description.toLowerCase();
//     const problems = await Probleme.find({});
//     const identifiedProblems = [];

//     for (const problem of problems) {
//         if (
//             lowerCaseDescription.includes(problem.keyword) ||
//             problem.synonyms.some(synonym => lowerCaseDescription.includes(synonym))
//         ) {
//             identifiedProblems.push({
//                 keyword: problem.keyword,
//                 diagnosis: problem.diagnosis,
//                 estimatedCost: problem.estimatedCost,
//             });
//         }
//     }

//     if (identifiedProblems.length === 0) {
//         return {
//             diagnosis: "Aucun problème identifié. Un diagnostic approfondi est nécessaire.",
//             estimatedCost: null,
//         };
//     }

//     const totalCost = identifiedProblems.reduce((sum, problem) => sum + problem.estimatedCost, 0);

//     return {
//         problems: identifiedProblems,
//         totalCost: totalCost,
//     };
// }


// router.get('/diag', async (req, res) => {
//     const description = "Ma voiture fait un bruit quand je freine, et la climatisation ne fonctionne pas, de plus, le moteur chauffe."

//     if (!description) {
//         return res.status(400).json({ error: "La description du problème est requise." });
//     }

//     // Analyser la description
//     const result = await analyseProblemes(description);

//     // Renvoyer le résultat
//     res.json({
//         description: description,
//         problems: result.problems,
//         totalCost: result.totalCost,
//     });
// });


module.exports = router