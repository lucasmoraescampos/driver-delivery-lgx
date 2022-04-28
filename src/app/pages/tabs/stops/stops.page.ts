import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArriveStopComponent } from 'src/app/components/arrive-stop/arrive-stop.component';
import { MoreInfoComponent } from 'src/app/components/more-info/more-info.component';
import { SkipStopComponent } from 'src/app/components/skip-stop/skip-stop.component';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TabsService } from 'src/app/services/tabs.service';

const { Geolocation } = Plugins;

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
    private route: ActivatedRoute,
    private tabsSrv: TabsService
  ) { }

  ngOnInit() {

    this.apiSrv.setProjectHash(this.route.snapshot.paramMap.get('route'));

    this.initProject();

    this.apiSrv.project.pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {

        if (project) {

          this.project = project;

          this.setTime();

        }

      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewWillEnter() {
    this.tabsSrv.setTabIndex(2);
  }

  public async moreInfo(index?: number) {

    const modal = await this.modalCtrl.create({
      component: MoreInfoComponent,
      componentProps: {
        data: {
          id: index !== undefined ? this.project.routes[index].end_id : this.project.driver.id,
          name: index !== undefined ? this.project.routes[index].end_name : this.project.driver.name,
          time: index !== undefined ? this.project.routes[index].time : this.project.driver.time,
          address: index !== undefined ? this.project.routes[index].end_address : this.project.routes[0].start_address,
          phone: index !== undefined ? this.project.routes[index].end_phone : null,
          image: index !== undefined ? this.project.routes[index].image : null,
          note: index !== undefined ? this.project.routes[index].note : null,
          bags: index !== undefined ? this.project.routes[index].bags : null,
          status: index !== undefined ? this.project.routes[index].status : null,
          order_id: index !== undefined ? this.project.routes[index].end_order_id : null,
          type: index !== undefined ? 'stop' : 'driver'
        }
      }
    });

    return await modal.present();

  }

  public startStop() {

    this.loadingSrv.show();

    this.apiSrv.startStop()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          for (let i = 0; i < this.project.routes.length; i++) {

            if (this.project.routes[i].status == 1) {

              const route = this.project.routes[i];

              const time = Math.round(route.duration / 60);

              const word = time > 1 ? 'minutes' : 'minute';

              const message = `Hi there! Your Shef delivery is on the way and will arrive in approximately ${time} ${word}!`;

              this.apiSrv.sendSMSByFariasSMS(route.end_name, route.end_phone, message).toPromise();

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

              break;

            }

          }

        }

      });

  }

  public async arrive(route: any) {

    const modal = await this.modalCtrl.create({
      component: ArriveStopComponent,
      componentProps: {
        data: {
          id: route.end_id,
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
          name: route.end_name,
          moreInfo: () => {
            this.moreInfo();
          }
        }
      }
    });

    return await modal.present();

  }

  private setTime() {

    let duration = 0;

    const split = this.project.driver.start_time.split(':');

    const date = new Date();

    date.setHours(Number(split[0]), Number(split[1]), 0, 0);

    this.project.driver.time = date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.project.routes.forEach((route: any) => {

      duration += route.duration;

      date.setHours(Number(split[0]), Number(split[1]), date.getSeconds() + duration, 0);

      route.time = date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      });

      duration += route.downtime;

    });

  }

  private initProject() {

    this.loadingSrv.show();

    this.apiSrv.getProject()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.project = res.data;

          this.setTime();

        }

      });

  }

}
