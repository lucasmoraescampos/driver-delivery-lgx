import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MoreInfoComponent } from './more-info.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  declarations: [MoreInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxIonicImageViewerModule
  ]
})
export class MoreInfoModule { }
