import { EUser } from './user.model';

export enum MenuItemEnum {
  watering = 1,
  SecondLevel = 1 << 1,
  Cap = 1 << 2,
  Street = 1 << 3,
  Rules = 1 << 4,
  Active = MenuItemEnum.watering |
    MenuItemEnum.SecondLevel |
    MenuItemEnum.Cap |
    MenuItemEnum.Street,
}

export class MenuItem {
  isExpand = false;
  constructor(
    public Name: string = null,
    public Icon: string = null,
    public Route: string = 'develop',
    public children: Array<MenuItem> = [],
    public userAcces: Array<EUser> = [],
  ) {}

  chekAcces(user: EUser) {
    return this.userAcces.includes(user);
  }
}

export const MenuItems: MenuItem[] = [
  new MenuItem('Освещение', 'fa fa-sun-o', '/sun', [
    new MenuItem('Гараж'),
    new MenuItem('Погреб'),
    new MenuItem('1 этаж', null, 'develop', [
      new MenuItem('Табмбур'),
      new MenuItem('Холл'),
      new MenuItem('Гостинная'),
      new MenuItem('Столовая'),
      new MenuItem('Кухня'),
      new MenuItem('Бассейн'),
    ]),
    new MenuItem('2 этаж'),
    new MenuItem('3 этаж'),
    new MenuItem('Улица'),
  ]),
  new MenuItem('Полив', 'fa fa-shower', '/watering', [], [EUser.Shower]),
  // new MenuItem('2 Этаж', '<span">2</span>', '/SecondLevel'),
  // new MenuItem('Цоколь', '<i class="fa fa-home" aria-hidden="true"></i>', '/Cap'),
  // new MenuItem('Улица', '<i class="fa fa-tree" aria-hidden="true"></i>', '/Street'),
  // new MenuItem('Активные', '<i class="fa fa-check-square-o" aria-hidden="true"></i>', '/Active'),
  // new MenuItem('Yandex Alice', '<i class="fa fa-yahoo" aria-hidden="true"></i>', '/Rules'),
];

export class MenuHelper {
  static getMenuItemByPath(path: string) {
    let menus = MenuItems;
    while (!!menus?.length) {
      const menu = menus.find((m) => m.Route === path);
      if (!!menu) {
        return menu;
      }
      menus = menus.reduce((a, b) => a.concat(b.children || []), []);
    }
    return null;
  }
}
