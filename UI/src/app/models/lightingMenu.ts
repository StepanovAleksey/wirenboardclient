import { MenuItem } from 'primeng/api';
import {
  ABaseMqttObj,
  AWbDevice,
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
    new WB_MR6C_Q('Основной свет', 'wb-mr6c_82', 1),
    new WB_MR6C_Q('Дежурный свет', 'wb-mr6c_82', 2),
  ]),
  new SimpleLightGroup(
    'Дежурный',
    [new WB_MR6C_Q('Основной свет', 'wb-mr6c_82', 1)],
    [new WB_MDM3_Q('Дежурный свет', 'wb-mr6c_82', 2)],
  ),
  new WB_MDM3_Q('Дежурный свет', 'wb-mr6c_82', 4),
  new CurtainGroup('Штора', [new Curtain(1, 1), new Curtain(1, 2)]),
]).setParent(baseMenuItem);

const TabmburMenu = new LightingMenuItem(EPath.Tabmbur, [
  new WB_MR6C_Q('Основной свет', 'wb-mr6c_13', 1),
  new WB_MR6C_Q('Дежурный свет', 'wb-mr6c_13', 2),
  new WB_MR6C_Q('Лента около зеркала', 'wb-mr6c_13', 3),
  new WB_MR6C_Q('Свет улица козырек', 'wb-mr6c_16', 1),
  new WB_MR6C_Q('Свет улица калитка', 'wb-mr6c_16', 2),
  new WB_MR6C_Q('Свет улица фасад', 'wb-mr6c_16', 3),
  new WB_MR6C_Q('Свет улица столбики', 'wb-mr6c_16', 4),
  new WB_MR6C_Q('Свет улица газон', 'wb-mr6c_16', 5),
]).setParent(FirstFloorMenu);

const GarageMenu = new LightingMenuItem(EPath.Garage, [
  new WB_MR6C_Q('Основной свет', 'wb-mr6c_18', 1),
  new WB_MR6C_Q('Дежурный свет', 'wb-mr6c_18', 2),
  new WB_MR6C_Q('Подсветка столбов 1', 'wb-mr6c_18', 3),
  new WB_MR6C_Q('Подсветка столбов 3 эл.щит', 'wb-mr6c_18', 4),
  new WB_MR6C_Q('навес основной', 'wb-mr6c_18', 5),
  new WB_MR6C_Q('навес гирлянды', 'wb-mr6c_16', 6),
]).setParent(FirstFloorMenu);

const HallMenu = new LightingMenuItem(EPath.Hall, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const FirstFloorSUMenu = new LightingMenuItem(EPath['1st_floor_su'], [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const LivingRoomMenu = new LightingMenuItem(EPath.Living_room, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const DiningRoomMenu = new LightingMenuItem(EPath.Dining_room, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const KitchenRoomMenu = new LightingMenuItem(EPath.Kitchen, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
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
  new WB_MR6C_Q('Основной свет', 'wb-mr6c_29', 1),
  new WB_MR6C_Q(' LED около зеркала', 'wb-mr6c_29', 2),
]).setParent(WineVaultMenu);
//#endregion

const SPAMenu = new LightingMenuItem(EPath.SPA, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const BoilerRoomMenu = new LightingMenuItem(EPath.Boiler_Room, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);

const FireplaceMenu = new LightingMenuItem(EPath.Fireplace, [
  new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1),
]).setParent(FirstFloorMenu);
//#endregion
