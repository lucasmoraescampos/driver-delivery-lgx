import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StopsPageRoutingModule } from './stops-routing.module';
import { StopsPage } from './stops.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { MoreInfoModule } from 'src/app/components/more-info/more-info.module';
import { ArriveStopModule } from 'src/app/components/arrive-stop/arrive-stop.module';
import { SkipStopModule } from 'src/app/components/skip-stop/skip-stop.module';
import { LoadingModule } from 'src/app/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    StopsPageRoutingModule,
    MoreInfoModule,
    ArriveStopModule,
    LoadingModule,
    SkipStopModule
  ],
  declarations: [StopsPage]
})
export class StopsPageModule {}
