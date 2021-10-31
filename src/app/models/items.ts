import { environment } from "src/environments/environment";
import { MenuItemEnum } from "./menuItems";

export class ItemCoil {
  static counter = 0;

  /** need UI */
  controlValue: boolean;
  Index = 0;

  get Description(): string {
    return this._description || this.Name;
  }

  constructor(
    public Name: string,
    public TopicLamp: string,
    public TopicSwitch: string,
    private _description: string = null,
    public Value = false
  ) {
    this.controlValue = Value;
    this.Index = ItemCoil.counter++;
  }
}
export class GroupItem {
  static counter = 0;
  Index = 0;

  constructor(
    public Name: string = null,
    public MenuItemValue: MenuItemEnum,
    public Items: ItemCoil[] = []
  ) {
    this.Index = GroupItem.counter++;
  }
}

export const ALARMS: ItemCoil[] = [
  new ItemCoil("Охрана", "/devices/app_alarms/controls/security", null),
  new ItemCoil("1 команта", "/devices/app_alarms/controls/alarm1", null),
  new ItemCoil("2 команта", "/devices/app_alarms/controls/alarm2", null),
  new ItemCoil("ошибка по питанию", "/devices/app_alarms/controls/errorpower", null),
  new ItemCoil("протечка 1", "/devices/app_alarms/controls/water1", null),
  new ItemCoil("протечка 2", "/devices/app_alarms/controls/water2", null),
  new ItemCoil("протечка 3", "/devices/app_alarms/controls/water3", null),
];
export const GroupItems: GroupItem[] = [
  //#region Цоколь
  new GroupItem("Зал", MenuItemEnum.FirstLevel, [
    new ItemCoil(
      "Основной 1",
      "/devices/lyght_out/controls/lamp_1",
      "/devices/lyght_in/controls/in_1"
    ),
    new ItemCoil(
      "Основной 2",
      "/devices/lyght_out/controls/lamp_2",
      "/devices/lyght_in/controls/in_2"
    ),
  ]),
  /*
    new IGroupItem('Прачечная', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_2/controls/Q6'),
    ]),
    new IGroupItem('Коридор зала', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_2/controls/Q7'),
    ]),
    new IGroupItem('Склад', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_2/controls/Q8'),
    ]),
    new IGroupItem('Лестница', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q1'),
    ]),
    new IGroupItem('Котельная', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q2'),
    ]),
    new IGroupItem('Коридор Котельной', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q3'),
    ]),
    new IGroupItem('Подсобка', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q4'),
    ]),
    new IGroupItem('Щитовая', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q5'),
    ]),
    new IGroupItem('Выход', MenuItemEnum.Cap, [
        new ItemCoil('Основной', '/devices/ld2-r8d_3/controls/Q6'),
    ]),
    new IGroupItem('Холодный склад', MenuItemEnum.Cap, [
        new ItemCoil('Основной 1', '/devices/wb-mr6c_1/controls/K1'),
    ]),
    //#endregion

    //#region 1-й этаж
    new IGroupItem('Столовая', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_4/controls/Q1'),
        new ItemCoil('Стол', '/devices/ld2-r8d_4/controls/Q2')
    ]),
    new IGroupItem('Кухня', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_4/controls/Q3'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_4/controls/Q4'),
    ]),
    new IGroupItem('Гостинная', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_4/controls/Q5'),
        new ItemCoil('Люстра', '/devices/ld2-r8d_4/controls/Q6'),
        new ItemCoil('Бра 1', '/devices/ld2-r8d_4/controls/Q7'),
        new ItemCoil('Бра 2', '/devices/ld2-r8d_4/controls/Q8'),
    ]),
    new IGroupItem('Коридор', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной 1', '/devices/ld2-r8d_5/controls/Q1'),
        new ItemCoil('Основной 2', '/devices/ld2-r8d_5/controls/Q2'),
        new ItemCoil('Зеркало', '/devices/ld2-r8d_5/controls/Q3'),
    ]),
    new IGroupItem('Прихожая', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_5/controls/Q4'),
        new ItemCoil('Зеркало', '/devices/ld2-r8d_5/controls/Q5'),
    ]),
    new IGroupItem('Гардероб', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_5/controls/Q6'),
    ]),
    new IGroupItem('Лестница', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_5/controls/Q7'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_6/controls/Q1'),
    ]),
    new IGroupItem('Терасса', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной 1', '/devices/ld2-r8d_3/controls/Q7'),
        new ItemCoil('Основной 2', '/devices/ld2-r8d_3/controls/Q8'),
    ]),
    new IGroupItem('Баня', MenuItemEnum.FirstLevel, [
        new ItemCoil('Переход', '/devices/ld2-r8d_5/controls/Q8'),
        new ItemCoil('Общий', '/devices/ld2-r8d_10/controls/Q8'),
    ]),
    new IGroupItem('Туалет', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_6/controls/Q2'),
        new ItemCoil('Зеркало', '/devices/ld2-r8d_6/controls/Q3'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_6/controls/Q4'),
    ]),
    new IGroupItem('Кабинет', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_6/controls/Q5'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_6/controls/Q6'),
        new ItemCoil('Бра', '/devices/ld2-r8d_6/controls/Q7'),
    ]),
    new IGroupItem('Гараж', MenuItemEnum.FirstLevel, [
        new ItemCoil('Основной 1', '/devices/ld2-r8d_7/controls/Q1'),
        new ItemCoil('Основной 2', '/devices/ld2-r8d_7/controls/Q2'),
        new ItemCoil('Уличные бра', '/devices/ld2-r8d_7/controls/Q3'),
        new ItemCoil('(Ворота). Колонны', '/devices/ld2-r8d_7/controls/Q4'),
        new ItemCoil('Хоз. Помещение', '/devices/ld2-r8d_6/controls/Q8'),
        new ItemCoil('Ворота (Вход/Забор)', '/devices/ld2-r8d_7/controls/Q5'),
    ]),
    //#endregion

    //#region 2-й этаж
    new IGroupItem('Десткая 1', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_7/controls/Q6'),
        new ItemCoil('Бра', '/devices/ld2-r8d_7/controls/Q7'),
    ]),
    new IGroupItem('Ванная', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_7/controls/Q8'),
        new ItemCoil('Зеркало', '/devices/ld2-r8d_8/controls/Q1'),
        new ItemCoil('Подсетка', '/devices/ld2-r8d_8/controls/Q2'),
    ]),
    new IGroupItem('Игровая', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_8/controls/Q3'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_8/controls/Q4'),
        new ItemCoil('Люстра', '/devices/ld2-r8d_9/controls/Q5'),
    ]),
    new IGroupItem('Детская 2', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_8/controls/Q5'),
        new ItemCoil('Бра', '/devices/ld2-r8d_8/controls/Q6'),
        new ItemCoil('Кладовка', '/devices/ld2-r8d_8/controls/Q7'),
    ]),
    new IGroupItem('Детская 3', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_9/controls/Q4'),
        new ItemCoil('Люстра', '/devices/ld2-r8d_9/controls/Q1'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_9/controls/Q2'),
        new ItemCoil('Кладовка', '/devices/ld2-r8d_8/controls/Q8'),
    ]),
    new IGroupItem('Джакузи', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_9/controls/Q7'),
        new ItemCoil('Зеркало', '/devices/ld2-r8d_9/controls/Q8'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_9/controls/Q6'),
    ]),
    new IGroupItem('Спальня', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_10/controls/Q2'),
        new ItemCoil('Бра 1', '/devices/ld2-r8d_10/controls/Q3'),
        new ItemCoil('Бра 2', '/devices/ld2-r8d_10/controls/Q4'),
        new ItemCoil('Гардероб', '/devices/ld2-r8d_10/controls/Q1'),
    ]),
    new IGroupItem('Лестница', MenuItemEnum.SecondLevel, [
        new ItemCoil('Основной', '/devices/ld2-r8d_10/controls/Q5'),
        new ItemCoil('Подсветка', '/devices/ld2-r8d_6/controls/Q1'),
    ]),
    //#endregion

    //#region  Улица
    new IGroupItem('Площадка', MenuItemEnum.Street, [
        new ItemCoil('Подсветка дома', '/devices/ld2-r8d_10/controls/Q7'),
        new ItemCoil('Дорожка', '/devices/ld2-r8d_10/controls/Q8'),
    ]),
    new IGroupItem('Ворота', MenuItemEnum.Street, [
        new ItemCoil('Вход/Забор (Гараж, Ворота)', '/devices/ld2-r8d_7/controls/Q5'),
        new ItemCoil('Колонны (Гараж, Ворота)', '/devices/ld2-r8d_7/controls/Q4'),
    ]),*/
];
