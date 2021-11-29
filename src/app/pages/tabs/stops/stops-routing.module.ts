import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StopsPage } from './stops.page';

const routes: Routes = [
  {
    path: '',
    component: StopsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StopsPageRoutingModule {}
