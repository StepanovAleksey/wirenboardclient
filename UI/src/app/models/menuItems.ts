import { EUserRole } from './user.model';
import { MenuItem } from 'primeng/api';
import { BASE_ROOM_MENU_ITEM } from './lightingMenu';

export class AppMenuItem implements MenuItem {
  isExpand = false;
  items: Array<MenuItem>;

  constructor(
    public label: string = null,
    public icon: string = null,
    public routerLink: string = '/main/develop',
    public userAcces: Array<EUserRole> = [],
  ) {}

  chekAcces(user: EUserRole) {
    return this.userAcces.includes(user);
  }
}

export const MENU_ITEMS: MenuItem[] = [
  BASE_ROOM_MENU_ITEM,
  new AppMenuItem('Шторы', 'pi pi-th-large', '/main/curtains'),
];

export class MenuHelper {
  static getMenuItemByPath(path: string) {
    let menus = MENU_ITEMS;
    while (menus?.length) {
      const menu = menus.find((m) => m.routerLink === path);
      if (menu) {
        return menu;
      }
      menus = menus.reduce((a, b) => a.concat(b.items || []), []);
    }
    return null;
  }
}
