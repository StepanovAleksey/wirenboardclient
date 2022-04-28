import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MenuComponent } from "./components/menu/menu.component";
import { BasePageComponent } from "./pages/base-page/base-page.component";
import { environment } from "src/environments/environment";
import { InputSwitchModule } from "primeng/inputswitch";
import { PanelModule } from "primeng/panel";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "./components/header/header.component";
import { RulesComponent } from "./pages/rules/rules.component";
import { AuthComponent } from "./components/auth/auth.component";
import { AuthServiceComponent } from "./service/auth-service/auth-service.component";
import { MqttModule } from "ngx-mqtt";
import { WateringComponent } from "./pages/watering/watering.component";
import { InputNumberModule } from "primeng/inputnumber";
import { CalendarModule } from "primeng/calendar";
import { ProgramsComponent } from "./pages/watering/programs/programs.component";
import { AccordionModule } from "primeng/accordion";
import { ZonesComponent } from "./pages/watering/zones/zones.component";
import { DropdownModule } from "primeng/dropdown";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BasePageComponent,
    HeaderComponent,
    RulesComponent,
    AuthComponent,
    AuthServiceComponent,
    WateringComponent,
    ProgramsComponent,
    ZonesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MqttModule.forRoot({
      hostname: environment.production
        ? window.location.hostname
        : environment.host,
      protocol: "ws",
      port: environment.port,
      clientId: "SmartHouse: " + Math.ceil(Math.random() * 10),
    }),
    InputSwitchModule,
    PanelModule,
    FormsModule,
    ButtonModule,
    DynamicDialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    AccordionModule,
    DropdownModule,
  ],
  providers: [AuthServiceComponent, DialogService],
  bootstrap: [AppComponent],
  entryComponents: [AuthComponent],
})
export class AppModule {}
