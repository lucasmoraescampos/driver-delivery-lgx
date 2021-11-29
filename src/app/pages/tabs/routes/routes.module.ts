import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoutesPageRoutingModule } from './routes-routing.module';
import { RoutesPage } from './routes.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { LoadingModule } from 'src/app/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    LoadingModule,
    RoutesPageRoutingModule
  ],
  declarations: [RoutesPage]
})
export class RoutesPageModule {}
