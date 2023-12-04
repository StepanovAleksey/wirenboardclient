import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeveloperPageComponent } from './pages/developer-page/developer-page.component';
import { WateringComponent } from './pages/watering/watering.component';
import { AuthGuard } from './guards/auth.guard';
import { CurtainsComponent } from './pages/curtains/curtains.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { BasePageComponent } from './pages/base-page/base-page.component';

const routes: Routes = [
  {
    path: 'main',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'lighting',
        component: BasePageComponent,
        title: 'Свет',
        
      },
      {
        path: 'watering',
        component: WateringComponent,
        title: 'Полив',
      },
      {
        path: 'curtains',
        component: CurtainsComponent,
        title: 'Шторы',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'lighting',
      },
    ],
  },
  {
    path: 'auth',
    pathMatch: 'full',
    component: AuthComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'main',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
