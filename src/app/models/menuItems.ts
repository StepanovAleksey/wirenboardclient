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
  constructor(
    public Name: string = null,
    public Icon: string = null,
    public Route: string = null
  ) {}
}

export const MenuItems: MenuItem[] = [
  new MenuItem(
    "Полив",
    '<i class="fa fa-shower" aria-hidden="true"></i>',
    "/watering"
  ),
  // new MenuItem('2 Этаж', '<span">2</span>', '/SecondLevel'),
  // new MenuItem('Цоколь', '<i class="fa fa-home" aria-hidden="true"></i>', '/Cap'),
  // new MenuItem('Улица', '<i class="fa fa-tree" aria-hidden="true"></i>', '/Street'),
  // new MenuItem('Активные', '<i class="fa fa-check-square-o" aria-hidden="true"></i>', '/Active'),
  // new MenuItem('Yandex Alice', '<i class="fa fa-yahoo" aria-hidden="true"></i>', '/Rules'),
];
