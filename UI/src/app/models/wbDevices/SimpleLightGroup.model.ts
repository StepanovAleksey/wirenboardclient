import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { WB_MR6C_Q } from './WB_MR6C_Q.model';
import { ABaseMqttObj } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';
import { debounceTime, map } from 'rxjs/operators';
import {
  EDeviceType,
  IAllItem,
  isCheckType,
  ISimpleLightGroup,
  IWB_MR6C_Q,
} from '../device.model';

/** модель для дежурного режима света */
export class SimpleLightGroup
  extends ABaseMqttObj
  implements ISimpleLightGroup
{
  public onOffStatus$ = new BehaviorSubject<boolean>(false);
  mainCoils: WB_MR6C_Q[];
  simpleCoils: WB_MR6C_Q[];
  type: EDeviceType.SimpleLightGroup;

  constructor(item: ISimpleLightGroup) {
    super(EMqqtServer.wb7, item.label);

    this.mainCoils = item.mainCoils.map((c) => new WB_MR6C_Q(c));
    this.simpleCoils = item.simpleCoils.map((c) => new WB_MR6C_Q(c));

    combineLatest(this.simpleCoils.map((lg) => lg.onOffStatus$))
      .pipe(debounceTime(100))
      .subscribe((onOffStatuses) => {
        this.onOffStatus$.next(onOffStatuses.reduce((a, b) => (a &&= b), true));
      });
  }

  public getAllColis() {
    return [...this.mainCoils, ...this.simpleCoils];
  }

  static canCreate(item: IAllItem) {
    return isCheckType<ISimpleLightGroup, EDeviceType.SimpleLightGroup>(
      item,
      EDeviceType.SimpleLightGroup,
    );
  }

  static create(item: IAllItem) {
    return new SimpleLightGroup(item as ISimpleLightGroup);
  }
}
