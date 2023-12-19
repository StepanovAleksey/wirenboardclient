import { EPath } from './tags';
import { EUserRole } from './user.model';
import { MenuItem } from 'primeng/api';
import { baseMenuItem } from './lightingMenu';

export class AppMenuItem implements MenuItem {
  isExpand = false;
  items: Array<MenuItem>;
  tagsHistory: Array<EPath> = [];

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

export const MenuItems: MenuItem[] = [
  baseMenuItem,
  new AppMenuItem('Полив', 'pi pi-calendar', '/main/watering', [
    EUserRole.Shower,
  ]),
  new AppMenuItem('Шторы', 'pi pi-th-large', '/main/curtains'),
];

export class MenuHelper {
  static getMenuItemByPath(path: string) {
    let menus = MenuItems;
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
