import fs from "fs";

const dir = '.././saveMemoryDataValueAquarium/';
const file = `${dir}data.json`;

export default class MemoryDataValue
{
    constructor() {
        this.miniTemp = 20;
        this.maxiTemp = 25;
        this.miniTds = 75;
        this.maxiTds = 400;
    }

    /*
    * Initialisation
    * Vérifie l'existence ou crée le dossier de sauvegarde des datas sur la SD
    */
    init() {
        try {
            if (fs.existsSync(file)) {
                this.readData();
            } else {
                this.createFolder();
                this.writeData();
            }
        } catch (e) {
            console.error(e);
        }
    }

    /*
    * création du dossier
    */
    createFolder() {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    /*
    * écriture des données
    */
    writeData() {
        const data = JSON.stringify(this);
        fs.writeFileSync(file, data);
    }

    /*
    * lecture des données
    */
    readData() {
        fs.readFile(file, (err, data) => {
            let dataParse = JSON.parse(data);
            this.setMiniTemp(dataParse.miniTemp);
            this.setMaxiTemp(dataParse.maxiTemp);
            this.setMiniTds(dataParse.miniTds);
            this.setMaxiTds(dataParse.maxiTds);
        });
    }

    /*
    * Getter And Setter
    */
    getMiniTemp() {
        return this.miniTemp;
    }

    getMaxiTemp() {
        return this.maxiTemp;
    }

    getMiniTds() {
        return this.miniTds;
    }

    getMaxiTds() {
        return this.maxiTds;
    }

    setMiniTemp(miniTempSave) {
        this.miniTemp = miniTempSave;
    }

    setMaxiTemp(maxiTempSave) {
        this.maxiTemp = maxiTempSave;
    }

    setMiniTds(miniTdsSave) {
        this.miniTds = miniTdsSave;
    }

    setMaxiTds(maxiTdsSave) {
        this.maxiTds = maxiTdsSave;
    }

    /*
    * Sauvegarde des données
    */
    saveMiniTemp(miniTempSave) {
        this.setMiniTemp(miniTempSave);
        this.writeData();
    }

    saveMaxiTemp(maxiTempSave) {
        this.setMaxiTemp(maxiTempSave);
        this.writeData();
    }

    saveMiniTds(miniTdsSave) {
        this.miniTds = miniTdsSave;
        this.writeData();
    }

    saveMaxiTds(maxiTdsSave) {
        this.maxiTds = maxiTdsSave;
        this.writeData();
    }

}

const memoryDataValue = new MemoryDataValue();
memoryDataValue.init();

export let miniTemp = memoryDataValue.getMiniTemp();
export let maxiTemp = memoryDataValue.getMaxiTemp();
export let miniTds = memoryDataValue.getMiniTds();
export let maxiTds = memoryDataValue.getMaxiTds();
