import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArriveStopComponent } from 'src/app/components/arrive-stop/arrive-stop.component';
import { MoreInfoComponent } from 'src/app/components/more-info/more-info.component';
import { SkipStopComponent } from 'src/app/components/skip-stop/skip-stop.component';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-stops',
  templateUrl: './stops.page.html',
  styleUrls: ['./stops.page.scss'],
})
export class StopsPage implements OnInit, OnDestroy {

  public project: any;

  private unsubscribe = new Subject();

  constructor(
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.apiSrv.setProjectHash(this.route.snapshot.paramMap.get('route'));

    this.initProject();

    this.apiSrv.project.pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {

        if (project) {

          this.project = project;

        }

      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public time(index: number) {

    let duration = 0;

    for (let i = 0; i <= index; i++) {
      duration += this.project.routes[i].duration;
    }

    const start_time = this.project.driver.start_time.split(':');

    const date = new Date();

    date.setHours(Number(start_time[0]), Number(start_time[1]), 0, 0);

    date.setSeconds(date.getSeconds() + duration);

    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });

  }

  public async moreInfo(index?: number) {

    const modal = await this.modalCtrl.create({
      component: MoreInfoComponent,
      componentProps: {
        data: {
          name:     index !== undefined ? this.project.routes[index].end_name     : this.project.driver.name,
          time:     index !== undefined ? this.time(index)                        : this.project.driver.start_time,
          address:  index !== undefined ? this.project.routes[index].end_address  : this.project.driver.start_address,
          phone:    index !== undefined ? this.project.routes[index].end_phone    : null,
          image:    index !== undefined ? this.project.routes[index].image        : null,
          note:     index !== undefined ? this.project.routes[index].note         : null,
          status:   index !== undefined ? this.project.routes[index].status       : null
        }
      }
    });

    return await modal.present();

  }

  public startProject() {

    this.loadingSrv.show();

    this.apiSrv.startProject()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.alertSrv.toast({
            icon: 'success',
            message: res.message
          });

        }

      });

  }

  public async arrive(route: any) {

    const modal = await this.modalCtrl.create({
      component: ArriveStopComponent,
      componentProps: {
        data: {
          name: route.end_name,
          moreInfo: () => {
            this.moreInfo();
          }
        }
      }
    });

    return await modal.present();

  }

  public async skip(route: any) {

    const modal = await this.modalCtrl.create({
      component: SkipStopComponent,
      componentProps: {
        data: {
          name: route.end_name
        }
      }
    });

    return await modal.present();

  }

  private initProject() {

    this.loadingSrv.show();

    this.apiSrv.getProject()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.project = res.data;
        }

      });

  }

}
