"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driverModel_1 = require("./models/driverModel");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("./serial");
const serialBus_1 = require("./serialBus");
const mqttClient_1 = require("./mqttClient");
const mqqtWbClient = new mqttClient_1.MqttWbClient();
const drivers = [
    new driverModel_1.Driver(1, 1, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 2, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 3, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 4, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 5, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 6, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 7, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 8, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 9, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 10, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 11, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 12, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 13, serialBus_1.serialBus, mqqtWbClient),
    new driverModel_1.Driver(1, 14, serialBus_1.serialBus, mqqtWbClient),
];
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get('/status', (req, res) => {
    res.json(drivers.map(d => ({
        position: d.lastDriverStatus$.value
    })));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map