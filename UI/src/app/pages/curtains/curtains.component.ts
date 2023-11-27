import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Curtain, Group } from './model';

interface IStatusResponce {
  position: number;
}



@Component({
  selector: 'app-curtains',
  templateUrl: './curtains.component.html',
  styleUrls: ['./curtains.component.less'],
  encapsulation: ViewEncapsulation.None

})
export class CurtainsComponent {
  private baseUrl = `http://${environment.host}:${environment.httpPort}`;

  setPercent = 0;
  percent = 0;
  groups: Array<Group> = [
    new Group('Гостинная', [new Curtain(1), new Curtain(2), new Curtain(3), new Curtain(4), new Curtain(5)]),
    new Group('Кухня', [new Curtain(6), new Curtain(7),]),
    new Group('Чайная', [new Curtain(8), new Curtain(9),]),
    new Group('Кабинет', [new Curtain(10), new Curtain(11),]),
    new Group('Бассейн', [new Curtain(12), new Curtain(13),]),
    new Group('Спальня', [new Curtain(14), new Curtain(15)]),
  ]
  constructor(private http: HttpClient) {
    this._updateStatus();
  }

  endSlider() {
    this.http
      .post(`${this.baseUrl}/goPercent`, { percent: this.setPercent })
      .subscribe();
  }

  sendCommand(command) {
    this.http.post(`${this.baseUrl}/command`, { command }).subscribe();
  }

  _updateStatus() {
    this.http
      .get<IStatusResponce>(`${this.baseUrl}/status`)
      .subscribe((responce) => {
        this.percent = responce.position;
        setTimeout(() => {
          this._updateStatus();
        }, 300);
      });
  }
}
