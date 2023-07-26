import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { BasePageComponent } from './pages/base-page/base-page.component';
import { environment } from 'src/environments/environment';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { RulesComponent } from './pages/rules/rules.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from './service/auth.service';
import { MqttModule } from 'ngx-mqtt';
import { WateringComponent } from './pages/watering/watering.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ProgramsComponent } from './pages/watering/programs/programs.component';
import { AccordionModule } from 'primeng/accordion';
import { ZonesComponent } from './pages/watering/zones/zones.component';
import { DropdownModule } from 'primeng/dropdown';
import { OptionsComponent } from './pages/watering/options/options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ManualRunComponent } from './pages/watering/manual-run/manual-run.component';
import { DeveloperPageComponent } from './pages/developer-page/developer-page.component';
import { TreeModule } from 'primeng/tree';
import { CurtainsComponent } from './pages/curtains/curtains.component';
import { SliderModule } from 'primeng/slider';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MqttModule.forRoot({
      hostname: environment.production
        ? window.location.hostname
        : environment.host,
      protocol: 'wss',
      port: environment.port,
      clientId: 'SmartHouse: ' + Math.ceil(Math.random() * 10),
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
    ReactiveFormsModule,
    TreeModule,
    SliderModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    MenuComponent,
    BasePageComponent,
    HeaderComponent,
    RulesComponent,
    WateringComponent,
    ProgramsComponent,
    ZonesComponent,
    OptionsComponent,
    ManualRunComponent,
    DeveloperPageComponent,
    AuthComponent,
    CurtainsComponent,
  ],
  providers: [AuthService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
