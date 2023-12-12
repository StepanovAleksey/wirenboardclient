import {
  ABaseMqttObj,
  EMqqtServer,
  MqqtService as wbTypeChanel,
} from '../service/mqqt.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { EPath } from './tags';
import {
  take,
  takeUntil,
  skip,
  debounceTime,
  tap,
  switchMap,
} from 'rxjs/operators';

/** типы каналов WB устройств */
export enum ETypeWbChanel {
  /** WB-MR6C-Q */
  WB_MR6C_Q = 'WB_MR6C_Q',

  /** WB-MR6C-I */
  WB_MR6C_I = 'WB_MR6C_I',

  /** WB-MDM3-Channel, значение мощности выхода */
  WB_MDM3_CH = 'WB_MDM3_CH',
}

/** шаблоны топиков */
const TOPIC_TEMPLATE: Record<ETypeWbChanel, string> = {
  [ETypeWbChanel.WB_MR6C_Q]: '/devices/{mqttDeviceAddr}/controls/K{cNumber}',
  [ETypeWbChanel.WB_MR6C_I]:
    '/devices/{mqttDeviceAddr}/controls/Input {cNumber}',
  [ETypeWbChanel.WB_MDM3_CH]:
    '/devices/{mqttDeviceAddr}/controls/Channel {cNumber}',
};

/** базовый класс для всех каналов WB устройств */
export abstract class AWbDevice extends ABaseMqttObj {
  constructor(
    public label: string,
    protected mqttDeviceAddr: string,
    protected coilId: number,
    /** задаётся местонахождение устройства,
     * идёт сравнение по ANY т.е. любое совпадение
     * путь до устройства задаётся в PATHES_INHERITANCE
     * */
    protected path: Array<EPath>,
    public typeWbChanel: ETypeWbChanel,
    mqqtService: wbTypeChanel,
    protected destroy$: Subject<void>,
  ) {
    super(mqqtService, destroy$, EMqqtServer.wb7);
  }

  public unsub() {
    this.destroy$.next();
  }
  public isExistTagsRoute(tags: Array<EPath>) {
    return this.path.some((t) => tags.includes(t));
  }

  protected getBaseTopic(
    typeDevice: ETypeWbChanel,
    mqttDeviceAddr: string,
    coilId: number,
  ) {
    if (!TOPIC_TEMPLATE[typeDevice]) {
      throw 'Неизвестный тип устройства';
    }
    return TOPIC_TEMPLATE[typeDevice]
      .replace('{mqttDeviceAddr}', mqttDeviceAddr.toString())
      .replace('{cNumber}', coilId.toString());
  }

  /** топик на управление */
  protected getChangeTopic(
    typeDevice: ETypeWbChanel,
    mqttDeviceAddr: string,
    coilId: number,
  ) {
    return `${this.getBaseTopic(typeDevice, mqttDeviceAddr, coilId)}/on`;
  }

  public abstract subscribeTopic(): void;
}

/*** класс для реле 6-и канального реле */
export class WB_MR6C_Q extends AWbDevice {
  public onOffStatus: boolean;

  constructor(
    public label: string,
    protected mqttDeviceAddr: string,
    protected coilId: number,
    protected path: Array<EPath>,
    mqqtService: wbTypeChanel,
    protected destroy$ = new Subject<void>(),
    public typeWbChanel = ETypeWbChanel.WB_MR6C_Q,
  ) {
    super(
      label,
      mqttDeviceAddr,
      coilId,
      path,
      typeWbChanel,
      mqqtService,
      destroy$,
    );
  }

  public subscribeTopic() {
    this.subTopic$<boolean>(`${this.getCoilTopic()}`).subscribe((data) => {
      this.onOffStatus = data;
    });
  }

  public toggleCoil() {
    this.pubTopic(
      this.getChangeTopic(
        ETypeWbChanel.WB_MR6C_Q,
        this.mqttDeviceAddr,
        this.coilId,
      ),
      this.onOffStatus ? 0 : 1,
    );
  }

  private getCoilTopic() {
    return super.getBaseTopic(
      ETypeWbChanel.WB_MR6C_Q,
      this.mqttDeviceAddr,
      this.coilId,
    );
  }
}

/** класс для управления катушкой и мощностью канала диммера */
export class WB_MDM3_Q extends WB_MR6C_Q {
  public chanelValue: number;

  private _setBrightness = new BehaviorSubject(0);

  public get setBrightness() {
    return this._setBrightness.value;
  }

  public set setBrightness(value: number) {
    this._setBrightness.next(value);
  }

  constructor(
    public label: string,
    protected mqttDeviceAddr: string,
    protected coilId: number,
    protected path: Array<EPath>,
    mqqtService: wbTypeChanel,
    protected destroy$ = new Subject<void>(),
  ) {
    super(
      label,
      mqttDeviceAddr,
      coilId,
      path,
      mqqtService,
      destroy$,
      ETypeWbChanel.WB_MDM3_CH,
    );
  }

  public subscribeTopic(): void {
    super.subscribeTopic();

    this.subBrightnessTopic$().subscribe((data) => {
      this.chanelValue = data;
    });

    this.subBrightnessTopic$()
      .pipe(
        take(1),
        tap((v) => {
          this._setBrightness.next(v);
        }),
        switchMap(() => this.subChangeBrightness$()),
      )
      .subscribe((setValue) => {
        this.pubTopic(
          this.getChangeTopic(
            ETypeWbChanel.WB_MDM3_CH,
            this.mqttDeviceAddr,
            this.coilId,
          ),
          setValue,
        );
      });
  }

  private subChangeBrightness$() {
    return this._setBrightness.pipe(
      skip(1),
      debounceTime(500),
      takeUntil(this.destroy$),
    );
  }

  private subBrightnessTopic$() {
    return this.subTopic$<number>(
      `${this.getBaseTopic(
        ETypeWbChanel.WB_MDM3_CH,
        this.mqttDeviceAddr,
        this.coilId,
      )}`,
    );
  }
}
