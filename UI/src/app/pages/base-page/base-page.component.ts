import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import {
  AWbDevice,
  ETypeWbChanel,
  WB_MDM3_Q,
  WB_MR6C_Q,
} from 'src/app/models/wbDevice.model';
import { LIGHTING_MENU_ELEM, TagMenuItem } from 'src/app/models/menuItems';
import { EPath } from 'src/app/models/tags';
import { WbChanelService } from 'src/app/service/wbChanel.service';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.less'],
})
export class BasePageComponent implements OnInit, OnDestroy {
  chanels: Array<AWbDevice> = [];
  childrenMenu: Map<TagMenuItem, Array<AWbDevice>> = new Map();
  menuItem = LIGHTING_MENU_ELEM;
  LIGHTING_MENU_ELEM = LIGHTING_MENU_ELEM;

  hystory: Array<TagMenuItem> = [];

  private allColls = [];

  constructor(
    private route: ActivatedRoute,
    private coilService: WbChanelService,
  ) {}

  ngOnDestroy(): void {
    this.clearCoils();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        tap((params) => {
          this.clearCoils();
          this.setChildTags(params);
        }),
      )
      .subscribe((params) => {
        if (params.tags) {
          this.setCoils(params.tags);
        }
      });
  }

  public getCoilsByMenuElem(menuElem: TagMenuItem) {
    const cols = this.coilService
      .getDeviceByTags(menuElem.historyTags)
      .map((c) => {
        c.subscribeTopic();
        return c;
      });
    this.allColls.push(...cols);
    return cols;
  }

  private setCoils(paramTags: Array<EPath>) {
    const cols = this.coilService.getDeviceByTags(paramTags).map((c) => {
      c.subscribeTopic();
      return c;
    });
    this.allColls.push(...cols);
    this.chanels = cols;
  }

  private clearCoils() {
    this.allColls.forEach((c) => c.unsub());
    this.chanels.length = 0;
    this.allColls.length = 0;
    this.childrenMenu.clear();
  }

  private setChildTags(params: any) {
    let tags: Array<EPath> = params.tags || [];
    if (typeof tags === 'string') {
      tags = [tags];
    }
    this.menuItem = LIGHTING_MENU_ELEM.findByTagHistory(tags);
    this.hystory = this.menuItem.getAllHistory();
    (this.menuItem.items || []).forEach((menuElem) => {
      this.childrenMenu.set(menuElem, this.getCoilsByMenuElem(menuElem));
    });
  }

  isCoilGuard(wbDevice: AWbDevice): wbDevice is WB_MR6C_Q {
    return wbDevice.typeWbChanel === ETypeWbChanel.WB_MR6C_Q;
  }
  isDimmGuard(wbDevice: AWbDevice): wbDevice is WB_MDM3_Q {
    return wbDevice.typeWbChanel === ETypeWbChanel.WB_MDM3_CH;
  }
}
