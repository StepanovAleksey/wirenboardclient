import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { WB_MR6C_Q } from './WB_MR6C_Q.model';
import { ABaseMqttObj } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';

/** модель для группы света */
export class LightGroup extends ABaseMqttObj {
  public onOffStatus$ = new BehaviorSubject<boolean>(false);

  constructor(label: string, public coils: Array<WB_MR6C_Q>) {
    super(EMqqtServer.wb7, label);
    combineLatest(coils.map((lg) => lg.onOffStatus$)).subscribe(
      (onOffStatuses) => {
        this.onOffStatus$.next(onOffStatuses.reduce((a, b) => (a &&= b), true));
      },
    );
  }
}
