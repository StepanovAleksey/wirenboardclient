import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAllItem, Room } from '../models/device.model';
import { DeviceFactoryHelper } from '../models/deviceFactory.helper';
import { BehaviorSubject } from 'rxjs';
import { BASE_ROOM_MENU_ITEM } from '../models/lightingMenu';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  rooms$ = new BehaviorSubject<Room[]>([]);

  constructor(private http: HttpClient) {
    this.http
      .get<Array<IAllItem>>('/assets/devices.json')
      .subscribe((items) => {
        const rooms = DeviceFactoryHelper.createItem(items);
        BASE_ROOM_MENU_ITEM.items = rooms;
        this.rooms$.next(rooms);
      });
  }
}
