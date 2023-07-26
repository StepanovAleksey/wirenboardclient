import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeveloperPageComponent } from './pages/developer-page/developer-page.component';
import { WateringComponent } from './pages/watering/watering.component';
import { AuthGuard } from './service/auth.guard';
import { CurtainsComponent } from './pages/curtains/curtains.component';

const routes: Routes = [
  {
    path: 'watering',
    component: WateringComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'curtains',
    component: CurtainsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: DeveloperPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
