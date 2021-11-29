import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapPageRoutingModule } from './map-routing.module';
import { MapPage } from './map.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { MoreInfoModule } from 'src/app/components/more-info/more-info.module';
import { ArriveStopModule } from 'src/app/components/arrive-stop/arrive-stop.module';
import { SkipStopModule } from 'src/app/components/skip-stop/skip-stop.module';
import { LoadingModule } from 'src/app/components/loading/loading.module';
import { ChooseMapModule } from 'src/app/components/choose-map/choose-map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    MoreInfoModule,
    ArriveStopModule,
    SkipStopModule,
    LoadingModule,
    MapPageRoutingModule,
    ChooseMapModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
