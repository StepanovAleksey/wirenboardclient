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
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuHelper } from './models/menuItems';

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
  pageName: string;
  constructor(
    private mqttService: MqttService,
    public authSrv: AuthService,
    private router: Router,
  ) {
    this.mqttService.onConnect.subscribe((s: IOnConnectEvent) => {
      console.log('status MQTT: ', s);
    });
    this.mqttService.onError.subscribe((error) => {
      console.error(error);
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const menu = MenuHelper.getMenuItemByPath(event.url);
        this.pageName = menu?.Name;
      });
  }
  doneAnimate() {
    this.isEndAnimateExpand = this.isExpandMenu;
  }
}
