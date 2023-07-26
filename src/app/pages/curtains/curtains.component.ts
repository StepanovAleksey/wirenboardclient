import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

interface IStatusResponce {
  position: number;
}
@Component({
  selector: 'app-curtains',
  templateUrl: './curtains.component.html',
  styleUrls: ['./curtains.component.less'],
})
export class CurtainsComponent {
  private baseUrl = `http://${environment.host}:${environment.httpPort}`;

  setPercent = 0;
  percent = 0;

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
