import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DriverStatusGuard } from 'src/app/guards/driver-status.guard';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthGuard, DriverStatusGuard]
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule),
        canActivate: [AuthGuard, DriverStatusGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule { }
