import { Observable } from 'rxjs';
export interface IMqqtEvent {
  topic: string;
  payload: string;
}
export interface IMqttWbClient {
  send<T>(topic: string, payload: T): void;
  subscribe$(topic: string): Observable<string>;
}
