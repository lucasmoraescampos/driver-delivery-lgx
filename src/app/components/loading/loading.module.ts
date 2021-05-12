import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    NgxLoadingModule
  ],
  exports: [LoadingComponent]
})
export class LoadingModule { }
