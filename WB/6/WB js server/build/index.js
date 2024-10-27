"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driverModel_1 = require("./models/driverModel");
require("./serialPortFacade");
const serialBus_1 = require("./serialBus");
const mqttClient_1 = require("./mqttClient");
const serialPortFacade_1 = require("./serialPortFacade");
const mqqtWbClient = new mqttClient_1.MqttWbClient({
    port: 18883,
    protocol: 'ws',
    // hostname: '127.0.0.1',
    //hostname: '192.168.1.106',
    hostname: '10.147.17.184', // 6ка
});
new serialPortFacade_1.SerialPortFacade(serialBus_1.serialBus, {
    // path: '/dev/ttyRS485-1',
    path: 'COM4',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
});
[
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
console.log('севрер запустился');
//# sourceMappingURL=index.js.map