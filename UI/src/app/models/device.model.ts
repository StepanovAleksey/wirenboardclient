import { MenuItem } from 'primeng/api';
import {
  CurtainGroup,
  FrequencyConverter,
  LightGroup,
  SimpleLightGroup,
  WB_MDM3_Q,
  WB_MR6C_Q,
} from './wbDevices';

export enum EDeviceType {
  Room = 'Room',
  LightGroup = 'LightGroup',
  SimpleLightGroup = 'SimpleLightGroup',
  WB_MR6C_Q = 'WB_MR6C_Q',
  WB_MDM3_Q = 'WB_MDM3_Q',
  CurtainGroup = 'CurtainGroup',
  Curtain = 'Curtain',
  FrequencyConverter = 'FrequencyConverter',
}

export interface IBaseDevice<T extends EDeviceType> {
  type: T;
}
export interface IBaseLabelDevice<T extends EDeviceType>
  extends IBaseDevice<T> {
  label: string;
}

export interface ICurtainDevice extends IBaseDevice<EDeviceType.Curtain> {
  groupId: number;
  chanelId: number;
}

export interface ICurtainGroup
  extends IBaseLabelDevice<EDeviceType.CurtainGroup> {
  children: Array<ICurtainDevice>;
}

export interface IBaseMqttDevice<T extends EDeviceType>
  extends IBaseLabelDevice<T> {
  mqttDeviceAddr: string;
  chanelId: number;
}

export interface IWB_MR6C_Q extends IBaseMqttDevice<EDeviceType.WB_MR6C_Q> {}

export interface IWB_MDM3_Q extends IBaseMqttDevice<EDeviceType.WB_MDM3_Q> {}

export interface ISimpleLightGroup
  extends IBaseLabelDevice<EDeviceType.SimpleLightGroup> {
  mainCoils: Array<IWB_MR6C_Q>;
  simpleCoils: Array<IWB_MR6C_Q>;
}

export interface ILightGroup extends IBaseLabelDevice<EDeviceType.LightGroup> {
  coils: Array<IWB_MR6C_Q>;
}

export interface IFrequencyConverter
  extends IBaseMqttDevice<EDeviceType.FrequencyConverter> {}

export type IAllItem =
  | ILightGroup
  | ICurtainDevice
  | ISimpleLightGroup
  | IWB_MR6C_Q
  | IWB_MDM3_Q
  | ICurtainGroup
  | IFrequencyConverter
  | IRoom;

export interface IRoom extends IBaseLabelDevice<EDeviceType.Room> {
  id: string;
  children: Array<IAllItem>;
}

export class BaseDevice<T extends EDeviceType> implements IBaseDevice<T> {
  type: T;
}

export class BaseLabelDevice<T extends EDeviceType>
  implements IBaseLabelDevice<T>
{
  label: string;
  type: T;
  constructor(item: BaseLabelDevice<T>) {
    (this.label = item.label), (this.type = item.type);
  }
}

export function isCheckType<TOut extends IAllItem, TType extends EDeviceType>(
  item: IAllItem,
  type: TType,
): item is TOut {
  return item.type === type;
}

export class Room
  extends BaseLabelDevice<EDeviceType.Room>
  implements IRoom, MenuItem
{
  id: string;

  children: IAllItem[];

  routerLink? = 'rooms';

  queryParams = {
    path: [],
  };

  get items() {
    const childRooms = this.children.filter(Room.canCreate);
    if (!childRooms.length) {
      return null;
    }
    return childRooms as Array<MenuItem>;
  }

  constructor(room: IRoom, private parent?: Room) {
    super(room);
    this.id = room.id;
    if (parent) {
      this.queryParams.path.push(...parent.queryParams.path.filter(Boolean));
    }
    this.queryParams.path.push(this.id);
    const EXIST_TYPES = [
      WB_MR6C_Q,
      WB_MDM3_Q,
      Room,
      CurtainGroup,
      SimpleLightGroup,
      LightGroup,
      FrequencyConverter,
    ];
    this.children = room.children
      .map((item) => {
        const t = EXIST_TYPES.find((et) => et.canCreate(item));
        if (!!t) {
          return t.create(item, this);
        }
        console.warn('Неизвестный тип', item);
        return null;
      })
      .filter(Boolean);
  }

  static canCreate(item: IAllItem) {
    return isCheckType<IRoom, EDeviceType.Room>(item, EDeviceType.Room);
  }

  static create(item: IAllItem, parent?: Room) {
    return new Room(item as IRoom, parent);
  }
}
