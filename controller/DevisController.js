function getDevis(tableau){
    let pu = 0;
    let mo = 0
    for(let i=0; i<tableau.length; i++){
        pu+= tableau[i].prixUnitaire
        mo+= tableau[i].main_d_oeuvre
    }
    return pu + mo
}

module.exports = { getDevis };
