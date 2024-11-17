import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CurtainGroup,
  FrequencyConverter,
  SimpleLightGroup,
  WB_MDM3_Q,
  WB_MR6C_Q,
} from 'src/app/models/wbDevices';
import { MenuItem } from 'primeng/api';
import { MqqtService } from 'src/app/service/mqqt.service';
import { LightGroup } from 'src/app/models/wbDevices/LightGroup.model';
import { EDeviceType, IAllItem, Room } from 'src/app/models/device.model';
import { RoomService } from 'src/app/service/room.service';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { isArray } from 'rxjs/internal-compatibility';
import { EMPTY_ROOM } from 'src/app/models/deviceFactory.helper';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BasePageComponent implements OnInit, OnDestroy {
  rooms$!: BehaviorSubject<Array<Room>>;

  private _activeRoom$ = new BehaviorSubject<Room>(EMPTY_ROOM);
  public get activeRoom$() {
    return this._activeRoom$;
  }
  public set activeRoom$(value) {
    this._activeRoom$ = value;
  }

  hystory: Array<MenuItem> = [];

  childRooms$!: Observable<Array<Room>>;

  devices$!: Observable<Array<IAllItem>>;

  destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private mqttSrv: MqqtService,
    private roomService: RoomService,
  ) {
    this.rooms$ = this.roomService.rooms$;
    EMPTY_ROOM.children = this.rooms$.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    this.childRooms$ = this.activeRoom$.pipe(
      map((r) => r.children.filter(this.isRoomGuard)),
    );

    this.devices$ = this.activeRoom$.pipe(
      map((r) => r.children.filter((item) => !this.isRoomGuard(item))),
    );

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.path) {
          this.setMenuItem(isArray(params.path) ? params.path : [params.path]);
          return;
        }
        this.activeRoom$.next(EMPTY_ROOM);
      });
  }

  private setMenuItem(pathIds: Array<string>) {
    let children = this.rooms$.value;
    const paths = pathIds.concat();
    const hystory = [];
    let room: Room;
    while (paths.length) {
      const path = paths.shift();
      room = children.find((r) => r.id === path);
      hystory.push(room);
      children = children.flatMap((c) => c.children.filter(this.isRoomGuard));
    }
    this.hystory = hystory;
    if (!room) {
      console.warn('Не найден путь');
      this.activeRoom$.next(EMPTY_ROOM);
      return;
    }
    this.activeRoom$.next(room);
  }

  offGroup(menuItem: Room) {
    menuItem.children.filter(this.isCoilGuard).forEach((coil) => {
      this.mqttSrv.publishTopic(coil.wbId, coil.getChangeCoilTopic(), 0);
    });
    menuItem.children
      .filter(this.isLightGroupGuard)
      .flatMap((groups) => groups.coils)
      .forEach((coil) => {
        this.mqttSrv.publishTopic(coil.wbId, coil.getChangeCoilTopic(), 0);
      });
  }

  isRoomGuard(item: any): item is Room {
    return item instanceof Room;
  }

  isCoilGuard(wbDevice: IAllItem): wbDevice is WB_MR6C_Q {
    return wbDevice.type === EDeviceType.WB_MR6C_Q;
  }

  isDimmGuard(wbDevice: IAllItem): wbDevice is WB_MDM3_Q {
    return wbDevice.type === EDeviceType.WB_MDM3_Q;
  }

  isLightGroupGuard(wbDevice: IAllItem): wbDevice is LightGroup {
    return wbDevice instanceof LightGroup;
  }

  isSimpleLightGroupGuard(wbDevice: IAllItem): wbDevice is SimpleLightGroup {
    return wbDevice instanceof SimpleLightGroup;
  }

  isCurtainGroupGuard(wbDevice: IAllItem): wbDevice is CurtainGroup {
    return wbDevice instanceof CurtainGroup;
  }

  isFrequencyConverter(wbDevice: IAllItem): wbDevice is FrequencyConverter {
    return wbDevice instanceof FrequencyConverter;
  }
}
