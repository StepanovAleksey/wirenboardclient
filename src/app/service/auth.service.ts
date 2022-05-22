import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthComponent } from 'src/app/components/auth/auth.component';
import { EUser, Users } from 'src/app/models/user.model';

const localSrgKey = 'Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAutorize$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<EUser>(undefined);

  constructor(public dialogService: DialogService) {
    this.isAutorize$.next(this.isAuth());
  }

  public checkUser(user: EUser) {
    return Users[user] === this.getUserPass();
  }

  public logOut() {
    localStorage.removeItem(localSrgKey);
    this.user$.next(undefined);
    this.isAutorize$.next(false);
    this.show();
  }

  private setUser() {
    const userPass = this.getUserPass();
    let user: EUser = null;
    Object.keys(Users).forEach((userKey: EUser) => {
      if (Users[userKey] === userPass) {
        user = userKey;
      }
    });
    if (!!user) {
      this.user$.next(user);
    }
  }

  public isAuth() {
    if (this.getUserPass()?.length) {
      this.setUser();
      return true;
    }
    this.show();
  }

  private getUserPass(): string {
    const pas = localStorage.getItem(localSrgKey);
    if (!pas) {
      return null;
    }
    return atob(pas);
  }

  private show(isError?: boolean) {
    const ref = this.dialogService.open(AuthComponent, {
      data: {
        hasError: isError,
      },
      header: 'Авторизируйтесь',
      style: { 'max-height': '350px', 'max-width': '350px' },
      closable: false,
      closeOnEscape: false,
    });

    ref.onClose.subscribe((pass: string) => {
      if (!this.validatePass(pass)) {
        this.show();
        return;
      }
      this.setAuth(btoa(pass));
      this.setUser();
      this.isAutorize$.next(true);
    });
  }

  private validatePass(pass: string): boolean {
    return Object.values(Users).includes(pass);
  }

  private setAuth(value: string) {
    localStorage.setItem(localSrgKey, value);
  }
}
