import {Gpio} from "onoff";
import { miniTemp, maxiTemp, miniTds, maxiTds } from "./MemoryDataValue.js";

const ledTds = new Gpio(4, 'low');
const ledTemp = new Gpio(17, 'low');

/*
* Gardien: surveille la température & commande un GPIO => LED
* */
export function guardTemperature(temp) {
    if (temp < miniTemp) {
        ledTemp.writeSync(1);
    } else if (temp > maxiTemp) {
        ledTemp.writeSync(1);
    } else {
        ledTemp.writeSync(0);
    }
}

/*
* Gardien: surveille le TDS << Total dissolved solids >> & commande un GPIO => LED
* */
export function guardTds(tds) {
    if (tds < miniTds) {
        ledTds.writeSync(1);
    } else if (tds > maxiTds) {
        ledTds.writeSync(1);
    } else {
        ledTds.writeSync(0);
    }
}
