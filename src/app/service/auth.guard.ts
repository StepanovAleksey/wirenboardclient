import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { MenuHelper } from '../models/menuItems';
import { EUser } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.checkUser(EUser.Admin)) {
      return true;
    }
    const menu = MenuHelper.getMenuItemByPath(state.url);
    return menu?.chekAcces(this.authService.user$.value);
  }
}
