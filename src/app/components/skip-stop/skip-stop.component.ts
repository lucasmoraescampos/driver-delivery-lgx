import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-skip-stop',
  templateUrl: './skip-stop.component.html',
  styleUrls: ['./skip-stop.component.scss'],
})
export class SkipStopComponent implements OnInit, OnDestroy {

  @Input() data: any;

  public option: number = 1;

  public note: string = 'Nobody home';

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    private apiSrv: ApiService,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss(false);
  }

  public changeOption(ev: any) {
    if (ev.detail.value == 1) {
      this.note = 'Nobody home';
    }
    else if (ev.detail.value == 2) {
      this.note = 'Wrong address';
    }
    else {
      this.note = '';
    }
  }

  public moreInfo() {
    this.data.moreInfo();
  }

  public skip() {

    if (!this.note) {

      this.alertSrv.toast({
        icon: 'warning',
        message: 'Tell us why you are skipping this parade!'
      });

    }

    else {

      this.loadingSrv.show();

      this.apiSrv.skipStop(this.note)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            if (res.data.status == 4) {

              const route = res.data.routes[res.data.routes.length - 1];

              const message = `Sorry, your delivery was not completed today.\n\nPlease contact our team to reschedule.`;

              this.apiSrv.sendSMS(route.start_name, route.end_phone, message).toPromise();

              this.alertSrv.show({
                icon: 'success',
                message: 'All stops on this project have been completed.',
                confirmButtonText: 'Go to Routes',
                showCancelButton: false,
                onConfirm: () => {
                  this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/routes`);
                }
              });

              this.modalCtrl.dismiss(true);

            }

            else {

              const length = res.data.routes.length;

              for (let index = length - 1; index >= 0; index--) {

                const route = res.data.routes[index];

                if (route.status == 3) {

                  const message = `Sorry, your delivery was not completed today.\n\nPlease contact our team to reschedule.`;

                  this.alertSrv.toast({
                    icon: 'success',
                    message: res.message
                  });

                  this.apiSrv.sendSMS(route.start_name, route.end_phone, message).toPromise();

                  this.modalCtrl.dismiss(true);

                  break;

                }

              }

            }

          }

        });

    }

  }

}
