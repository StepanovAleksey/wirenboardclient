import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MenuHelper } from '../models/menuItems';
import { EUserRole } from '../models/user.model';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!this.authService.user$.value) {
      return next;
    }
    return this.router.parseUrl('/auth');
  }
}
