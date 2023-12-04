import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  isExpandMenu = false;
  isEndAnimateExpand = false;
  pageName: string;
  public menuVisible = false;
  constructor(public authSrv: AuthService) {}

  doneAnimate() {
    this.isEndAnimateExpand = this.isExpandMenu;
  }
}
