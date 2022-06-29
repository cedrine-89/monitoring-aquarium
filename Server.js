import fetch from "node-fetch";
import WaterQuality from "./modules/WaterQuality.js";
import { guardTds, guardTemperature } from "./modules/functions.js";
import { createServer } from "http";
import { Server } from "socket.io";
import MemoryDataValue, { miniTemp, maxiTemp, miniTds, maxiTds } from "./modules/MemoryDataValue.js";

const urlArduino = 'http://192.168.1.150';
const capacityAquarium = 120;
let connectArduino = false;
let temp = undefined;
let tds = undefined;
let tdsGrammeLitre = undefined;
let waterQuality = undefined;
const server = createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET"]
    }
});
const memoryData = new MemoryDataValue();

memoryData.init();
server.listen(5555);

setInterval(() => {
    fetch(urlArduino)
        .then(res => {
            res.json()
                .then(response => {
                    connectArduino = true;
                    temp = response.data.temp;
                    tds = response.data.tds;
                    tdsGrammeLitre = (tds * capacityAquarium) / 1000;
                    waterQuality = new WaterQuality(temp, tds, tdsGrammeLitre);
                    guardTemperature(temp);
                    guardTds(tds);
                });
        }).catch(err => {
            connectArduino = false;
        });
},2000);

io.on("connection", socket => {
    setInterval(() => {
        socket.emit("connectArduino", connectArduino);
        socket.emit("miniTemp", memoryData.getMiniTemp());
        socket.emit("maxiTemp", memoryData.getMaxiTemp());
        socket.emit("miniTds", memoryData.getMiniTds());
        socket.emit("maxiTds", memoryData.getMaxiTds());
        socket.emit("temp", temp);
        socket.emit("tds", tds);
        socket.emit("tdsGrammeLitre", tdsGrammeLitre);
    }, 1000);

    socket.on("updateMiniTemp", d => {
        if (d) {
            memoryData.saveMiniTemp(parseFloat(d));
        }
    });

    socket.on("updateMaxiTemp", d => {
        if (d) {
            memoryData.saveMaxiTemp(parseFloat(d));
        }
    });

    socket.on("updateMiniTDS", d => {
        if (d) {
            memoryData.saveMiniTds(parseFloat(d));
        }
    });

    socket.on("updateMaxiTDS", d => {
        if (d) {
            memoryData.saveMaxiTds(parseFloat(d));
        }
    });
});
