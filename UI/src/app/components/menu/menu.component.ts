import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItems } from 'src/app/models/menuItems';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  MenuItems = MenuItems;

  @Output() expandMenuEvent = new EventEmitter<boolean>();

  isExpand = false;

  constructor() {}

  ngOnInit() {}
}
