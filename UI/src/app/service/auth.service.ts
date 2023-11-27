import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, from, of } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { map } from 'rxjs/operators';
import { EUserRole, USERS, UserModel } from 'src/app/models/user.model';

const localSrgKey = 'Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<UserModel>(undefined);

  constructor(public dialogService: DialogService) {
    this.setUser();
  }

  public logOut() {
    localStorage.removeItem(localSrgKey);
    this.user$.next(undefined);
  }

  private setUser() {
    const userPass = this.getUserPass();
    const user = USERS.find(u => u.password === userPass);
    this.user$.next(user);
  }

  public login(pass: string): Observable<boolean> {
    return of(null).pipe(
      map(() => {
        const result = this.validatePass(pass);
        if (result) {
          this.savePassword(pass);
          this.setUser();
        }
        return result
      })
    )
  }



  private getUserPass(): string {
    return localStorage.getItem(localSrgKey);
  }

  private validatePass(pass: string): boolean {
    return USERS.map(u => u.password).includes(pass);
  }

  private savePassword(value: string) {
    localStorage.setItem(localSrgKey, value);
  }
}
