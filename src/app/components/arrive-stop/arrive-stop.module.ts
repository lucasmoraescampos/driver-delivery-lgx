import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArriveStopComponent } from './arrive-stop.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { NgxImageCompressService } from 'ngx-image-compress';

@NgModule({
  declarations: [ArriveStopComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LoadingModule
  ],
  providers: [
    NgxImageCompressService
  ]
})
export class ArriveStopModule { }
