/*
* Classe: Objet des données, pour sauvegarder en JSON
*/
export default class WaterQuality {
    constructor(temperature, tds, tdsGrammeLitre) {
        this.data = {
            temperature: temperature.toFixed(2),
            tds: tds.toFixed(2),
            tdsGrammeLitre: tdsGrammeLitre.toFixed(2)
        }
        /*
        * tdsGrammeLitre représente le total en milligramme de sels minéraux calculer sur la capacité de l'aquarium
        * divisé par 1000 pour obtenir les Grammes
        * */
    }
}
