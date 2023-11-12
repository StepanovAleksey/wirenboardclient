import * as mqtt from 'mqtt';
import { MqttClient, connect } from 'mqtt';
import { IMqqtEvent, IMqttWbClient } from './models/contracts';
import { Observable, Subject, filter, map } from 'rxjs';

const WB_TOPICS: Array<string> = [];

export class MqttWbClient implements IMqttWbClient {

    client: MqttClient = null;
    mqqtMessage$ = new Subject<IMqqtEvent>();

    constructor(url: string = '127.0.0.1') {
        this.client = mqtt.connect("mqtt://127.0.0.1");
        this.init(WB_TOPICS);
    }

    subscribe$(topic: string): Observable<string> {
        this.client.subscribe(topic);
        return this.mqqtMessage$.pipe(filter(event => event.topic === topic), map(event => event.payload))
    }

    private subTopic(topic: string) {
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    private init(topics: Array<string>) {
        this.client.on("connect", () => {
            topics.forEach(topic => this.subTopic(topic));
        });

        this.client.on("message", (topic, message) => {
            this.mqqtMessage$.next({
                topic, payload: message.toString()
            })

        });
    }

    public send<T>(topic: string, payload: T) {
        this.client.publish(topic, JSON.stringify(payload))
    }
}