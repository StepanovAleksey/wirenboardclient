import { Component } from '@angular/core';
import { IOnConnectEvent, MqttService } from 'ngx-mqtt';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
  isExpandMenu = false;
  isEndAnimateExpand = false;
  pageName: string;

  constructor(
    private mqttService: MqttService,
    public authSrv: AuthService,
  ) {
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
