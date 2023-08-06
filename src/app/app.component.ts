import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  constructor(private authSrv: AuthService, private router: Router) {
    this.authSrv.user$.pipe(filter((user) => !user)).subscribe(() => {
      this.router.navigateByUrl('/auth');
    });
  }
}
