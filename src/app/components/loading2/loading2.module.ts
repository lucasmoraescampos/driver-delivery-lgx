import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loading2Component } from './loading2.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [Loading2Component],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [Loading2Component]
})
export class Loading2Module { }
