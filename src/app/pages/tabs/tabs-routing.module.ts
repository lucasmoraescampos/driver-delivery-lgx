import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: ':driver',
    component: TabsPage,
    children: [
      {
        path: 'routes',
        loadChildren: () => import('../routes/routes.module').then(m => m.RoutesPageModule)
      },
      {
        path: 'map/route/:route',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'stops/route/:route',
        loadChildren: () => import('../stops/stops.module').then(m => m.StopsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
