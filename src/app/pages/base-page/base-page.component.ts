import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupItems, ItemCoil, IGroupItem } from 'src/app/models/items';
import { Subscription, Subject } from 'rxjs';
import { MqttService, SubscriptionGrant } from 'ngx-mqtt-client';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceComponent } from 'src/app/service/auth-service/auth-service.component';
import { MenuItemEnum } from 'src/app/models/menuItems';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.less']
})
export class BasePageComponent implements OnInit, OnDestroy {

  isOnlyActiveItems = false;
  items = GroupItems;
  filterItems: IGroupItem[] = [];
  localSubscription = new Subscription();
  updateAcitveEvent$ = new Subject();

  constructor(
    private mqttService: MqttService,
    private route: ActivatedRoute,
    private authServiceComponent: AuthServiceComponent) {
    route.data.subscribe(d => {
      const routeData: MenuItemEnum = d.filter;
      this.items = GroupItems.filter(gi => gi.MenuItemValue & routeData);
      this.isOnlyActiveItems = routeData === MenuItemEnum.Active;
      if (!this.isOnlyActiveItems) {
        this.filterItems = this.items;
      }
    });
  }

  ngOnInit() {
    this.items.forEach(group => {
      group.Items.forEach(item => {
        this.localSubscription.add(
          this.mqttService.subscribeTo<boolean>(item.Topic).subscribe((value: boolean | SubscriptionGrant) => {
            if (value instanceof SubscriptionGrant) {

            } else {
              this.coilEventHandler(value, item.Topic);
              this.updateAcitveEvent$.next();
            }
          })
        );
      });
    });
    this.localSubscription.add(
      this.updateAcitveEvent$.pipe(
        debounceTime(1000),
        filter(_ => this.isOnlyActiveItems)
      ).subscribe(_ => {
        this._filterActiveItems();
      }));
    this.updateAcitveEvent$.next();
  }

  isActiveElem(item: ItemCoil): boolean {
    return this.isOnlyActiveItems && item.Value;
  }

  ngOnDestroy(): void {
    this.localSubscription.unsubscribe();
  }

  coilChange(item: ItemCoil, value: boolean | number) {
    if (!this.authServiceComponent.IsAuth) {
      return;
    }
    const sendValue = value ? 1 : 0;
    this.localSubscription.add(
      this.mqttService.publishTo(item.TopicON, sendValue).subscribe()
    );
  }

  sendMassCmd(items: ItemCoil[], value: number) {
    if (!this.authServiceComponent.IsAuth) {
      return;
    }
    items.forEach(item => {
      this.coilChange(item, value);
    });
  }

  private coilEventHandler(value: boolean, topic: string) {
    GroupItems.forEach(group => {
      group.Items.filter(item => item.Topic === topic).forEach(item => item.Value = value);
    });
  }

  private _filterActiveItems() {
    this.filterItems = GroupItems.filter(item => item.Items.some(childitem => childitem.Value));
  }

}
