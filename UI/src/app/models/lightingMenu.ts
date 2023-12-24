import { MenuItem } from 'primeng/api';
import {
  ABaseMqttObj,
  Curtain,
  CurtainGroup,
  SimpleLightGroup,
  WB_MDM3_Q,
  WB_MR6C_Q,
} from './wbDevices';
import { EPath, PATH_TRANSLATE } from './tags';
import { LightGroup } from './wbDevices/LightGroup.model';

export class LightingMenuItem implements MenuItem {
  routerLink = '/main/develop';

  label!: string;

  icon: string;

  parent: LightingMenuItem;

  expanded = false;
  items?: LightingMenuItem[];

  get queryParams() {
    const path = [this.path];
    let parent = this.parent;
    while (!!parent) {
      path.unshift(parent.path);
      parent = parent.parent;
    }
    return {
      path,
    };
  }

  constructor(
    protected path: EPath,
    public deviceChanels: Array<ABaseMqttObj>,
  ) {
    this.label = PATH_TRANSLATE[path];
  }

  public setParent(parent: LightingMenuItem) {
    parent.items = parent.items || [];
    parent.items.push(this);
    this.parent = parent;
    return this;
  }

  public setIcon(icon: string) {
    this.icon = icon;
    return this;
  }

  protected findChildrenByPath(path: EPath): LightingMenuItem {
    return this.items.find((item) => item.path === path);
  }

  public findItemByPath(path: Array<EPath>): LightingMenuItem {
    let findElem: LightingMenuItem = this;
    while (path.length && !!findElem) {
      findElem = findElem.findChildrenByPath(path.shift()) || findElem;
    }
    return findElem;
  }
}

export const baseMenuItem = new LightingMenuItem(EPath.Lighting, []).setIcon(
  'pi pi-sun',
);

//#region  1-ый этаж
const FirstFloorMenu = new LightingMenuItem(EPath['1st_floor'], [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_82', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_82', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_82', 1)],
    [new WB_MDM3_Q('Дежурный', 'wb-mr6c_82', 2)],
  ),
  new WB_MR6C_Q('Дежурный', 'wb-mr6c_82', 4),
  new CurtainGroup('Штора', [new Curtain(1, 1), new Curtain(1, 2)]),
]).setParent(baseMenuItem);

const TabmburMenu = new LightingMenuItem(EPath.Tabmbur, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_13', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_13', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_13', 1)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_13', 2)],
  ),
  new WB_MR6C_Q('Лента около зеркала', 'wb-mr6c_13', 3),
  new WB_MR6C_Q('Улица козырек', 'wb-mr6c_16', 1),
  new WB_MR6C_Q('Улица калитка', 'wb-mr6c_16', 2),
  new WB_MR6C_Q('Улица фасад', 'wb-mr6c_16', 3),
  new WB_MR6C_Q('Улица столбики', 'wb-mr6c_16', 4),
  new WB_MR6C_Q('Улица газон', 'wb-mr6c_16', 5),
]).setParent(FirstFloorMenu);

const GarageMenu = new LightingMenuItem(EPath.Garage, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_18', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_18', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_18', 1)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_18', 2)],
  ),
  new WB_MR6C_Q('Подсветка столбов 1', 'wb-mr6c_18', 3),
  new WB_MR6C_Q('Подсветка столбов 3 эл.щит', 'wb-mr6c_18', 4),
  new WB_MR6C_Q('навес основной', 'wb-mr6c_18', 5),
  new WB_MR6C_Q('навес гирлянды', 'wb-mr6c_16', 6),
]).setParent(FirstFloorMenu);

const HallMenu = new LightingMenuItem(EPath.Hall, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_13', 4),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_13', 5),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_13', 4)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_13', 5)],
  ),
  new WB_MR6C_Q('Трек 1, ближе к выходу', 'wb-mr6c_13', 6),
]).setParent(FirstFloorMenu);

const FirstFloorSUMenu = new LightingMenuItem(EPath['1st_floor_su'], [
  new WB_MR6C_Q('Основной', 'wb-mr6c_25', 1),
  new WB_MR6C_Q('БРА около зеркала', 'wb-mr6c_25', 2),
]).setParent(FirstFloorMenu);

const LivingRoomMenu = new LightingMenuItem(EPath.Living_room, [
  new WB_MR6C_Q('Люстра', 'wb-mr6c_25', 3),
  new WB_MR6C_Q('Столб LED 1 и 2 этажи', 'wb-mr6c_25', 4),
  new WB_MR6C_Q('Обдув конвектора под большим окном', 'wb-mr6c_25', 5),
  new WB_MR6C_Q('Трек 2, ближе к гостиной', 'wb-mr6c_25', 6),
]).setParent(FirstFloorMenu);

const DiningRoomMenu = new LightingMenuItem(EPath.Dining_room, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_27', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_27', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_27', 1)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_27', 2)],
  ),
  new WB_MR6C_Q('Камин, 2 точки', 'wb-mr6c_27', 3),
]).setParent(FirstFloorMenu);

const KitchenRoomMenu = new LightingMenuItem(EPath.Kitchen, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_28', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_28', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_28', 1)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_28', 2)],
  ),
  new WB_MR6C_Q('Фартук', 'wb-mr6c_28', 3),
  new WB_MR6C_Q('ХозБлок 2 точки', 'wb-mr6c_28', 4),
]).setParent(FirstFloorMenu);

//#region  Винный погреб
const WineVaultMenu = new LightingMenuItem(EPath.Wine_Vault, [
  new WB_MR6C_Q('Лестница 6 шт', 'wb-mr6c_28', 5),
  new WB_MR6C_Q('Лестница Бра на стене 6 шт', 'wb-mr6c_28', 6),
]).setParent(FirstFloorMenu);

const WineVaultHoll = new LightingMenuItem(EPath.Wine_Vault_Hall, [
  new WB_MR6C_Q('Потолок LED круги', 'wb-mr6c_27', 4),
  new WB_MR6C_Q('Стена Бра', 'wb-mr6c_27', 5),
  new WB_MR6C_Q('Стена  LED подсветка периметр', 'wb-mr6c_27', 6),
]).setParent(WineVaultMenu);

const WineVaultSU = new LightingMenuItem(EPath.Wine_Vault_SU, [
  new WB_MR6C_Q('Основной', 'wb-mr6c_29', 1),
  new WB_MR6C_Q('LED около зеркала', 'wb-mr6c_29', 2),
]).setParent(WineVaultMenu);
//#endregion

//#region  СПА
const SpaMenu = new LightingMenuItem(EPath.SPA, []).setParent(FirstFloorMenu);

const SpaPoolMenu = new LightingMenuItem(EPath.SPA_Pool, [
  new WB_MDM3_Q('Основной', 'wb-mdm3_14', 1),
  new WB_MR6C_Q('Бра на стене', 'wb-mr6c_50', 1),
  new WB_MR6C_Q('LED Лента на потолке 2шт.', 'wb-mr6c_50', 2),
  new WB_MR6C_Q('LED Лента на одеяле 1шт.', 'wb-mr6c_50', 3),
  new WB_MR6C_Q('Подсветка кухни', 'wb-mr6c_29', 3),
]).setParent(SpaMenu);

const SpaShowerRoomMenu = new LightingMenuItem(EPath.SPA_Shower_Room, [
  new WB_MR6C_Q('Зеркало', 'wb-mr6c_50', 4),
  new WB_MR6C_Q('LED лента на потолке', 'wb-mr6c_50', 5),
  new WB_MR6C_Q('точки 4шт.', 'wb-mr6c_50', 6),
]).setParent(SpaMenu);

const SpaSaunMenu = new LightingMenuItem(EPath.SPA_Saun, [
  new WB_MR6C_Q('Основной', 'wb-mr6c_29', 4),
  new WB_MR6C_Q('Подсветка камня', 'wb-mr6c_29', 5),
]).setParent(SpaMenu);

const SpaSuMenu = new LightingMenuItem(EPath.SPA_SU, [
  new WB_MR6C_Q('Основной', 'wb-mr6c_29', 6),
]).setParent(SpaMenu);
//#endregion

const FireplaceMenu = new LightingMenuItem(EPath.Fireplace, [
  new LightGroup('Основной', [
    new WB_MR6C_Q('Основной', 'wb-mr6c_51', 1),
    new WB_MR6C_Q('Дежурный', 'wb-mr6c_51', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной', 'wb-mr6c_51', 1)],
    [new WB_MR6C_Q('Дежурный', 'wb-mr6c_51', 2)],
  ),
  new WB_MR6C_Q('Люстра над столом', 'wb-mr6c_51', 3),
  new WB_MR6C_Q('Подсветка изнутри', 'wb-mr6c_51', 4),
  new WB_MR6C_Q('Подсветка доп стола', 'wb-mr6c_51', 5),
  new WB_MR6C_Q('Гирлянды', 'wb-mr6c_51', 6),
]).setParent(FirstFloorMenu);
//#endregion
