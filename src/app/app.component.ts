import { Component, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { IOnConnectEvent, MqttService } from 'ngx-mqtt';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [
    trigger('MinExpan', [
      state(
        'min',
        style({
          width: '60px',
        }),
      ),
      state(
        'expan',
        style({
          width: '220px',
        }),
      ),
      transition('min => expan', [animate('0.3s')]),
      transition('expan => min', [animate('0.3s')]),
    ]),
  ],
})
export class AppComponent {
  isExpandMenu = false;
  isEndAnimateExpand = false;
  constructor(private mqttService: MqttService, public authSrv: AuthService) {
    this.mqttService.onConnect.subscribe((s: IOnConnectEvent) => {
      console.log('status MQTT: ', s);
    });
    this.mqttService.onError.subscribe((error) => {
      console.error(error);
    });
  }
  doneAnimate() {
    this.isEndAnimateExpand = this.isExpandMenu;
  }
}
