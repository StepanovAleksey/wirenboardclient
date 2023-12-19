import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { WB_MR6C_Q } from './WB_MR6C_Q.model';
import { ABaseMqttObj } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';
import { debounceTime, map } from 'rxjs/operators';

/** модель для дежурного режима света */
export class SimpleLightGroup extends ABaseMqttObj {
  public onOffStatus$ = new BehaviorSubject<boolean>(false);

  constructor(
    label: string,
    public mainCoils: Array<WB_MR6C_Q>,
    public simpleCoils: Array<WB_MR6C_Q>,
  ) {
    super(EMqqtServer.wb7, label);
    combineLatest(simpleCoils.map((lg) => lg.onOffStatus$))
      .pipe(debounceTime(100))
      .subscribe((onOffStatuses) => {
        this.onOffStatus$.next(onOffStatuses.reduce((a, b) => (a &&= b), true));
      });
  }

  public getAllColis() {
    return [...this.mainCoils, ...this.simpleCoils];
  }
}
