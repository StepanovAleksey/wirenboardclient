import { BehaviorSubject } from 'rxjs';
import { ABaseMqttObj, ETypeWbChanel, TOPIC_TEMPLATE } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';
import {
  EDeviceType,
  IAllItem,
  ICurtainDevice,
  ICurtainGroup,
  isCheckType,
} from '../device.model';

/** класс для драйверов штор */
export class Curtain implements ICurtainDevice {
  public position$ = new BehaviorSubject<number>(0);
  groupId: number;
  chanelId: number;

  constructor(item: ICurtainDevice) {
    Object.assign(this, item);
  }

  type: EDeviceType.Curtain;

  getCommandTopic() {
    return TOPIC_TEMPLATE[ETypeWbChanel.CURTAIN_COMMAND]
      .replace('{groupId}', this.groupId.toString())
      .replace('{chanleId}', this.chanelId.toString());
  }

  static canCreate(item: ICurtainDevice) {
    return isCheckType<ICurtainDevice, EDeviceType.Curtain>(
      item,
      EDeviceType.Curtain,
    );
  }

  static create(item: IAllItem) {
    return new Curtain(item as ICurtainDevice);
  }
}

/** класс для управления группой драверов штор */
export class CurtainGroup extends ABaseMqttObj implements ICurtainGroup {
  children: ICurtainDevice[];
  type: EDeviceType.CurtainGroup;

  constructor(item: ICurtainGroup) {
    super(EMqqtServer.wb7, item.label);
    this.children = item.children.map((child) => new Curtain(child));
  }

  static canCreate(item: IAllItem) {
    return isCheckType<ICurtainGroup, EDeviceType.CurtainGroup>(
      item,
      EDeviceType.CurtainGroup,
    );
  }

  static create(item: IAllItem) {
    return new CurtainGroup(item as ICurtainGroup);
  }
}
