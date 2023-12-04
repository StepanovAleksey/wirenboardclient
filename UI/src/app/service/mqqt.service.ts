import { Injectable } from '@angular/core';
import mqtt, { MqttClient } from 'mqtt';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/** список всех WB устройств */
export enum EMqqtServer {
  wb6 = 'wb6',
  wb7 = 'wb7',
}

export interface IMqqtRespone<T = any> {
  wbDevice: EMqqtServer;
  topic: string;
  payload: T;
}

interface ISubTopic extends Map<string, Set<any>> {}

@Injectable({
  providedIn: 'root',
})
export class MqqtService {
  clients: Record<EMqqtServer, MqttClient>;
  private message$ = new Subject<IMqqtRespone>();

  /** активные клиенты на топик */
  private topicSubClients: Record<EMqqtServer, ISubTopic> = {
    wb6: new Map<string, Set<any>>(),
    wb7: new Map<string, Set<any>>(),
  };

  constructor() {
    this.clients = {
      wb6: mqtt.connect({
        port: 18883,
        protocol: 'ws',
        hostname: environment.wb6MqqtAddr,
      }),
      wb7: mqtt.connect({
        port: 18883,
        protocol: 'ws',
        hostname: environment.wb7MqqtAddr,
      }),
    };
    Object.entries(this.clients).forEach(([key, client]) =>
      this.onInitConnect(key as EMqqtServer, client),
    );
  }

  public publishTopic<T>(wbDevice: EMqqtServer, topic: string, payload: T) {
    this.clients[wbDevice].publish(topic, JSON.stringify(payload));
  }

  /**
   * Подписка на топк
   * !! Если подписадись надо обязательно отписаться через unSubscribeClient!!
   * @param wbDevice
   * @param topic
   * @param objRef ссылка на объект подписчик (нуен для корректной работы отписки от топика)
   * @returns
   */
  public subscribeTopic$<T>(wbDevice: EMqqtServer, topic: string, objRef: any) {
    this.clients[wbDevice].subscribe(topic, (err) => {
      if (err) {
        console.warn('Ошибка подписки MQQT', wbDevice, topic);
      }
    });
    if (!this.topicSubClients[wbDevice].has(topic)) {
      this.topicSubClients[wbDevice].set(topic, new Set<any>());
    }
    this.topicSubClients[wbDevice].get(topic).add(objRef);

    return this.message$.pipe(
      filter((msg) => wbDevice === msg.wbDevice && msg.topic === topic),
      map((msg) => msg.payload as T),
    );
  }

  /**
   * Отписка от топика
   * @param wbDevice
   * @param objRef ссылка на объект подписчик
   */
  public unSubscribeClient(wbDevice: EMqqtServer, objRef: any) {
    this.topicSubClients[wbDevice].forEach((topic) => {
      topic.delete(objRef);
    });
    this.topicSubClients[wbDevice].forEach((objRefArr, topic) => {
      if (objRefArr.size < 1) {
        this.unsunbscribeTopic(wbDevice, topic);
        this.topicSubClients[wbDevice].delete(topic);
      }
    });
  }

  private unsunbscribeTopic(wbDevice: EMqqtServer, topic: string) {
    this.clients[wbDevice].unsubscribe(topic);
  }

  private onInitConnect(wbDevice: EMqqtServer, client: MqttClient) {
    client.on('connect', () => {
      console.log(wbDevice, 'mqqt connected');
    });
    client.on('message', (topic, message) => {
      this.message$.next({
        payload: JSON.parse(message.toString()),
        topic,
        wbDevice,
      });
    });
  }
}

/**
 * базовый класс для всех mqtt устройств
 */
export abstract class ABaseMqttObj {
  constructor(
    private mqqtService: MqqtService,
    protected destroy$: Subject<void>,
    protected wbId: EMqqtServer,
  ) {
    this.destroy$.pipe(take(1)).subscribe(() => {
      this.mqqtService.unSubscribeClient(wbId, this);
    });
  }

  protected subTopic$<T>(topic: string) {
    return this.mqqtService
      .subscribeTopic$<T>(EMqqtServer.wb7, topic, this)
      .pipe(takeUntil(this.destroy$));
  }

  protected pubTopic<T>(topic: string, payload: T) {
    this.mqqtService.publishTopic(this.wbId, topic, payload);
  }
}
