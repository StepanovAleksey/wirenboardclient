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
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { RulesComponent } from './pages/rules/rules.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthService } from './service/auth.service';
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
import { CurtainsGroupComponent } from './pages/curtains/curtains-group/curtains-group.component';
import { PasswordModule } from 'primeng/password';
import { LayoutComponent } from './pages/layout/layout.component';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MqqtService } from './service/mqqt.service';
import { CoilComponent } from './pages/base-page/coil/coil.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    PasswordModule,
    RippleModule,
    SidebarModule,
    PanelMenuModule,
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
    CurtainsGroupComponent,
    LayoutComponent,
    CoilComponent,
  ],
  providers: [AuthService, DialogService, MqqtService],
  bootstrap: [AppComponent],
})
export class AppModule {}
