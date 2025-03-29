function getDevis(tableau) {
    let pu = 0;
    let mo = 0
    for (let i = 0; i < tableau.length; i++) {
        pu += (tableau[i].prixUnitaire * tableau[i].quantite)
        mo += tableau[i].main_d_oeuvre
    }
    return pu + mo
}


function getProgression(stocks) {
    var isaTrue = 0;
    var max = 100;
    var isaMax = stocks.length
    var pourcentage = 0

    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].etat == true) {
            isaTrue += 1
        }
    }
    pourcentage = (isaTrue * max) / isaMax
    return pourcentage;

}

module.exports = { getDevis, getProgression };
