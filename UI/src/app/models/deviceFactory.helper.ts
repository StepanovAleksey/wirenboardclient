import { EDeviceType, IAllItem, IRoom, Room } from './device.model';

export const EMPTY_ROOM = new Room({
  children: [],
  id: null,
  label: null,
  type: EDeviceType.Room,
});

export class DeviceFactoryHelper {
  static createItem(devices: Array<IAllItem>) {
    return devices
      .filter((d) => Room.canCreate(d))
      .map((d: IRoom) => new Room(d, EMPTY_ROOM));
  }
}
