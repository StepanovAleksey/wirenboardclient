import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IAllItem } from './models/device.model';
import { DeviceFactoryHelper } from './models/deviceFactory.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.authSrv.user$.pipe(filter((user) => !user)).subscribe(() => {
      this.router.navigateByUrl('/auth');
    });
  }
}
