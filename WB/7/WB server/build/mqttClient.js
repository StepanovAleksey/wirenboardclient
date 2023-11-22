"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttWbClient = void 0;
const mqtt = __importStar(require("mqtt"));
const rxjs_1 = require("rxjs");
const WB_TOPICS = [];
class MqttWbClient {
    constructor(url = '127.0.0.1') {
        this.client = null;
        this.mqqtMessage$ = new rxjs_1.Subject();
        this.client = mqtt.connect("mqtt://127.0.0.1");
        this.init(WB_TOPICS);
    }
    subscribe$(topic) {
        this.client.subscribe(topic);
        return this.mqqtMessage$.pipe((0, rxjs_1.filter)(event => event.topic === topic), (0, rxjs_1.map)(event => event.payload));
    }
    subTopic(topic) {
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    init(topics) {
        this.client.on("connect", () => {
            topics.forEach(topic => this.subTopic(topic));
        });
        this.client.on("message", (topic, message) => {
            this.mqqtMessage$.next({
                topic, payload: message.toString()
            });
        });
    }
    send(topic, payload) {
        this.client.publish(topic, JSON.stringify(payload));
    }
}
exports.MqttWbClient = MqttWbClient;
//# sourceMappingURL=mqttClient.js.map