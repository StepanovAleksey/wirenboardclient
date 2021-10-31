import { Component, Inject } from '@angular/core';
import { MqttService, ConnectionStatus } from 'ngx-mqtt-client';
import { environment } from 'src/environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [
    trigger('MinExpan', [
      state('min', style({
        width: '60px',
      })),
      state('expan', style({
        width: '220px',
      })),
      transition('min => expan', [
        animate('0.3s')
      ]),
      transition('expan => min', [
        animate('0.3s')
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'Умный дом';
  isExpandMenu = false;
  isEndAnimateExpand = false;
  constructor(
    private mqttService: MqttService) {
    this.mqttService.status().subscribe((s: ConnectionStatus) => {
      const status = s === ConnectionStatus.CONNECTED ? 'CONNECTED' : 'DISCONNECTED';
      console.log('status MQTT: ' + status);
    });
    if (!environment.production) {
      // localStorage.clear();
    }
  }
  doneAnimate() {
    this.isEndAnimateExpand = this.isExpandMenu;
  }
}
