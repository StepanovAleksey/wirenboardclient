import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthed = false;
  constructor() {
    this.isAuthed = this.isAuth;
  }
  get isAuth(): boolean {
    return JSON.parse(localStorage.getItem('Auth'));
  }
}
