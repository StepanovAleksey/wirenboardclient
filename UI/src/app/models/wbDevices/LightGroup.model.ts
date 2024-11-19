import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { WB_MR6C_Q } from './WB_MR6C_Q.model';
import { ABaseMqttObj } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';
import {
  EDeviceType,
  IAllItem,
  ILightGroup,
  isCheckType,
} from '../device.model';

/** модель для группы света */
export class LightGroup extends ABaseMqttObj implements ILightGroup {
  public onOffStatus$ = new BehaviorSubject<boolean>(false);
  coils: WB_MR6C_Q[];
  type: EDeviceType.LightGroup;
  constructor(item: ILightGroup) {
    super(EMqqtServer.wb7, item.label);
    this.type = item.type;
    this.coils = item.coils.map((c) => new WB_MR6C_Q(c));

    combineLatest(this.coils.map((lg) => lg.onOffStatus$)).subscribe(
      (onOffStatuses) => {
        this.onOffStatus$.next(onOffStatuses.reduce((a, b) => (a &&= b), true));
      },
    );
  }

  static canCreate(item: IAllItem) {
    return isCheckType<ILightGroup, EDeviceType.LightGroup>(
      item,
      EDeviceType.LightGroup,
    );
  }

  static create(item: IAllItem) {
    return new LightGroup(item as ILightGroup);
  }
}
