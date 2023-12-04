import { Injectable } from '@angular/core';
import { ETypeCoil, ItemCoil } from '../models/itemCoil';
import { MqqtService } from './mqqt.service';
import { ETags } from '../models/tags';

@Injectable({
  providedIn: 'root',
})
export class CoilService {
  coils: Array<ItemCoil> = [];

  constructor(mqqtService: MqqtService) {
    this.coils = [
      new ItemCoil(
        'Люстра 1',
        ETypeCoil.output,
        'wb-mr6c_28',
        1,
        [ETags.Garage],
        mqqtService,
      ),
      new ItemCoil(
        'Люстра 100',
        ETypeCoil.output,
        'wb-mr6c_28',
        2,
        [ETags.Cellar, ETags.Garage],
        mqqtService,
      ),
      new ItemCoil(
        'Люстра 99',
        ETypeCoil.output,
        'wb-mr6c_28',
        3,
        [ETags.Cellar, ETags.Garage],
        mqqtService,
      ),
      new ItemCoil(
        'Люстра 88',
        ETypeCoil.output,
        'wb-mr6c_28',
        4,
        [ETags.Cellar, ETags.Garage],
        mqqtService,
      ),
      new ItemCoil(
        'Люстра 6',
        ETypeCoil.output,
        'wb-mr6c_28',
        5,
        [ETags.Hall, ETags.Garage],
        mqqtService,
      ),
      new ItemCoil(
        'Люстра 4',
        ETypeCoil.output,
        'wb-mr6c_28',
        6,
        [ETags.Hall, ETags.Garage],
        mqqtService,
      ),
    ];
  }

  public getDeviceByTags(tags: Array<ETags>) {
    return this.coils.filter((c) => c.isExistTagsRoute(tags));
  }
}
