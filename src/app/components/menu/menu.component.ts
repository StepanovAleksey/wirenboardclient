import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MenuItems } from 'src/app/models/menuItems';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { EUser } from 'src/app/models/user.model';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  MenuItems = [];
  m = MenuItems;
  @Output() expandMenuEvent = new EventEmitter<boolean>();
  @Input() isEndAnimateExpand: boolean;

  isExpand = false;

  constructor(router: Router, private authSrv: AuthService) {
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (this.isExpand) {
          this.expandMenu();
        }
      });
  }

  ngOnInit() {
    this.authSrv.user$.subscribe((user) => {
      if (this.authSrv.checkUser(EUser.Admin)) {
        this.MenuItems = MenuItems;
        return;
      }
      this.MenuItems = MenuItems.filter((m) => m.userAcces.includes(user));
    });
  }

  expandMenu() {
    this.isExpand = !this.isExpand;
    this.expandMenuEvent.emit(this.isExpand);
  }
}
