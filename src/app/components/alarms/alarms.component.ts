import { Component, OnDestroy, OnInit } from "@angular/core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { ALARMS } from "src/app/models/items";

@Component({
  selector: "app-alarms",
  templateUrl: "./alarms.component.html",
  styleUrls: ["./alarms.component.less"],
})
export class AlarmsComponent implements OnInit, OnDestroy {
  localSubscription = new Subscription();
  ALARMS = ALARMS;
  activeAlarms = [];
  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    ALARMS.forEach((alarm) => {
      this.localSubscription.add(
        this.mqttService
          .observe(alarm.TopicLamp)
          .subscribe((message: IMqttMessage) => {
            alarm.Value = Boolean(parseInt(message.payload.toString()));
            this.filterAlarms();
          })
      );
    });
  }
  filterAlarms() {
    this.activeAlarms = ALARMS.filter((a) => a.Value);
  }
  ngOnDestroy(): void {
    this.localSubscription.unsubscribe();
  }
}
