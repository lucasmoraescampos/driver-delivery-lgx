import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportPageRoutingModule } from './report-routing.module';
import { ReportPage } from './report.page';
import { Loading2Module } from 'src/app/components/loading2/loading2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Loading2Module,
    ReportPageRoutingModule
  ],
  declarations: [ReportPage]
})
export class ReportPageModule {}
