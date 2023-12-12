import { Injectable } from '@angular/core';
import { AWbDevice, WB_MDM3_Q, WB_MR6C_Q } from '../models/wbDevice.model';
import { MqqtService } from './mqqt.service';
import { EPath } from '../models/tags';

@Injectable({
  providedIn: 'root',
})
export class WbChanelService {
  coils: Array<AWbDevice> = [];

  constructor(mqqtService: MqqtService) {
    this.coils = [
      new WB_MR6C_Q('Люстра 1', 'wb-mr6c_28', 1, [EPath.Garage], mqqtService),
      new WB_MR6C_Q(
        'Люстра 100',
        'wb-mr6c_28',
        2,
        [EPath.Cellar, EPath.Garage],
        mqqtService,
      ),
      new WB_MR6C_Q(
        'Люстра 99',
        'wb-mr6c_28',
        3,
        [EPath.Cellar, EPath.Garage],
        mqqtService,
      ),
      new WB_MR6C_Q(
        'Люстра 88',
        'wb-mr6c_28',
        4,
        [EPath.Cellar, EPath.Garage],
        mqqtService,
      ),
      new WB_MR6C_Q(
        'Люстра 6',
        'wb-mr6c_28',
        5,
        [EPath.Hall, EPath.Garage],
        mqqtService,
      ),
      new WB_MR6C_Q(
        'Люстра 4',
        'wb-mr6c_28',
        6,
        [EPath.Hall, EPath.Garage],
        mqqtService,
      ),
      new WB_MDM3_Q(
        'Диммер 1',
        'wb-mdm3_190',
        1,
        [EPath['1st_floor'], EPath.Hall, EPath.Garage],
        mqqtService,
      ),
    ];
  }

  public getDeviceByTags(tags: Array<EPath>) {
    return this.coils.filter((c) => c.isExistTagsRoute(tags));
  }
}
