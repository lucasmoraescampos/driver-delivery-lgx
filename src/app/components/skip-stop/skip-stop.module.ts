import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkipStopComponent } from './skip-stop.component';
import { IonicModule } from '@ionic/angular';
import { LoadingModule } from '../loading/loading.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SkipStopComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LoadingModule
  ]
})
export class SkipStopModule { }
