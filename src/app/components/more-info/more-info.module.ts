import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MoreInfoComponent } from './more-info.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ArriveStopModule } from '../arrive-stop/arrive-stop.module';

@NgModule({
  declarations: [MoreInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxIonicImageViewerModule,
    ArriveStopModule
  ]
})
export class MoreInfoModule { }
