import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CurtainGroup,
  ETypeWbChanel,
  SimpleLightGroup,
  WB_MDM3_Q,
  WB_MR6C_Q,
} from 'src/app/models/wbDevices';
import { EPath } from 'src/app/models/tags';
import { LightingMenuItem, baseMenuItem } from 'src/app/models/lightingMenu';
import { MenuItem } from 'primeng/api';
import { MqqtService } from 'src/app/service/mqqt.service';
import { LightGroup } from 'src/app/models/wbDevices/LightGroup.model';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BasePageComponent implements OnInit, OnDestroy {
  menuItem = baseMenuItem;
  hystory: Array<MenuItem> = [baseMenuItem];

  constructor(private route: ActivatedRoute, private mqttSrv: MqqtService) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.path) {
        this.setMenuItem(params.path);
      }
    });
  }

  private setMenuItem(path: Array<EPath>) {
    if (typeof path === 'string') {
      path = [path];
    }
    this.menuItem = baseMenuItem.findItemByPath(path);
    let parent = this.menuItem;
    const hystory = [];
    while (!!parent) {
      hystory.unshift(parent);
      parent = parent.parent;
    }
    this.hystory = hystory;
  }

  offGroup(menuItem: LightingMenuItem) {
    menuItem.deviceChanels
      .filter((chanel) => chanel instanceof WB_MR6C_Q)
      .forEach((coil: WB_MR6C_Q) => {
        this.mqttSrv.publishTopic(coil.wbId, coil.getChangeCoilTopic(), 0);
      });

    menuItem.deviceChanels
      .filter((chanel) => chanel instanceof LightGroup)
      .forEach((groups: LightGroup) => {
        groups.coils.forEach((coil) => {
          this.mqttSrv.publishTopic(coil.wbId, coil.getChangeCoilTopic(), 0);
        });
      });
  }

  isCoilGuard(wbDevice: any): wbDevice is WB_MR6C_Q {
    return wbDevice.typeWbChanel === ETypeWbChanel.WB_MR6C_Q;
  }

  isDimmGuard(wbDevice: any): wbDevice is WB_MDM3_Q {
    return wbDevice.typeWbChanel === ETypeWbChanel.WB_MDM3_CH;
  }

  isLightGroupGuard(wbDevice: any): wbDevice is LightGroup {
    return wbDevice instanceof LightGroup;
  }

  isSimpleLightGroupGuard(wbDevice: any): wbDevice is SimpleLightGroup {
    return wbDevice instanceof SimpleLightGroup;
  }

  isCurtainGroupGuard(wbDevice: any): wbDevice is CurtainGroup {
    return wbDevice instanceof CurtainGroup;
  }
}
