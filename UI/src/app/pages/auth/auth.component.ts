import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent {
  password: string;

  constructor(private authSrv: AuthService, private router: Router) { }

  login() {
    this.authSrv.login(this.password)
      .pipe(filter(result => result))
      .subscribe(() => {
        this.router.navigateByUrl('/main');
      });
  }
}
