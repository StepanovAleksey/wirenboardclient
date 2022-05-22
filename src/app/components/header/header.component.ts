import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
  appName = 'О-Азис';
  constructor(private authSrv: AuthService, private titleService: Title) {
    this.titleService.setTitle(this.appName);
  }

  logout() {
    this.authSrv.logOut();
  }
}
