import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  readonly today: string = moment().format('YYYY-MM-DD');

  public loading: boolean;

  public startDate: string;

  public endDate: string;

  public report: any[];

  public details: any[];

  private unsubscribe$ = new Subject();

  constructor(
    private apiSrv: ApiService
  ) { }

  ngOnInit() {

    this.startDate  = this.today;
    this.endDate    = this.today;

    this.load();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public formatDate(date: string, offset: number) {
    return formatDate(date, 'MMM d, y, h:mm a', 'en-US', UtilsHelper.utcOffsetString(offset));
  }

  public segmentChanged(ev: any) {
    this.slides.slideTo(ev.target.value);
  }

  public load() {
    this.loadReport();
    this.loadDetails();
  }

  private loadReport() {

    const params = {
      start_date: this.startDate.slice(0, 10),
      end_date: this.endDate.slice(0, 10)
    }

    this.apiSrv.report(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.report = res.data;
      });

  }

  private loadDetails() {

    this.loading = true;

    const params = {
      start_date: this.startDate.slice(0, 10),
      end_date: this.endDate.slice(0, 10)
    }

    this.apiSrv.reportDetails(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.loading = false;
        this.details = res.data;
      });

  }

}
