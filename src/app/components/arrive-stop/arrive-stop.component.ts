import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { NgxImageCompressService } from 'ngx-image-compress';

const { Camera, Device } = Plugins;

@Component({
  selector: 'app-arrive-stop',
  templateUrl: './arrive-stop.component.html',
  styleUrls: ['./arrive-stop.component.scss'],
})
export class ArriveStopComponent implements OnInit, OnDestroy {

  @Input() data: any;

  public webUseInput: boolean;

  public bags: number;

  public note: string;

  public option: boolean = false;

  public image: string;

  private unsubscribe = new Subject();

  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private navCtrl: NavController,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit() {
    Device.getInfo().then(device => this.webUseInput = device.platform === 'web');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss(false);
  }

  public moreInfo() {
    this.data.moreInfo();
  }

  public async chooseImage() {

    try {

      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        webUseInput: this.webUseInput
      });

      this.loadingSrv.show();

      this.image = await this.imageCompress.compressFile(image.dataUrl, 0, 50, 50);

      this.loadingSrv.hide();

    } catch (err) {

      this.loadingSrv.hide();

    }

  }

  public confirm() {

    if (!this.image) {

      this.alertSrv.toast({
        icon: 'error',
        message: 'Send a confirmation photo'
      });

    }

    else if (this.option && !this.bags) {

      this.alertSrv.toast({
        icon: 'error',
        message: 'Enter the number of bags collected'
      });

    }

    else {

      this.loadingSrv.show();

      const formData = new FormData();

      formData.append('image', UtilsHelper.base64toBlob(this.image));

      if (this.bags) {
        formData.append('bags', String(this.bags));
      }

      if (this.note) {
        formData.append('note', String(this.note));
      }

      if (this.data.status == 3) {

        this.apiSrv.changeStatus(this.data.id, formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              if (res.data.status == 4) {

                const route = res.data.routes[res.data.routes.length - 1];
                const date = new Date(route.arrived_at);
                var arrived_at = date.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                arrived_at = this.tConvert(arrived_at);

                var body = `Woohoo! Your Shef delivery was completed today at ${arrived_at}`;

                if( res?.data?.driver?.phone != '' && res?.data?.driver?.order_id != '')
                  body += ` , https://app.fariaslgx.com/where-is-my-order/${res?.data?.driver?.order_id}/${res?.data?.driver?.phone}`;

                this.alertSrv.sms({
                  icon: 'success',
                  title: res.message,
                  message: `Send delivery confirmation sms to ${route.end_name}`,
                  body: body,
                  phone: route.end_phone,
                  onConfirm: () => {

                    this.alertSrv.show({
                      icon: 'success',
                      message: 'All stops on this project have been completed.',
                      confirmButtonText: 'Go to Routes',
                      showCancelButton: false,
                      onConfirm: () => {
                        this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/routes`);
                      }
                    });

                  },
                  onCancel: () => {

                    this.alertSrv.show({
                      icon: 'success',
                      message: 'All stops on this project have been completed.',
                      confirmButtonText: 'Go to Routes',
                      showCancelButton: false,
                      onConfirm: () => {
                        this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/routes`);
                      }
                    });

                  }
                });

                this.modalCtrl.dismiss(true);

              }
              else {

                const length = res.data.routes.length;

                for (let index = length - 1; index >= 0; index--) {

                  const route = res.data.routes[index];

                  if (route.status == 2) {

                    const date = new Date(route.arrived_at);
                    var arrived_at = date.toLocaleTimeString(navigator.language, {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    arrived_at = this.tConvert(arrived_at);

                    var body = `Woohoo! Your Shef delivery was completed today at ${arrived_at}`;

                    if( res?.data?.driver?.phone != '' && res?.data?.driver?.order_id != '')
                      body += ` , https://app.fariaslgx.com/where-is-my-order/${res?.data?.driver?.order_id}/${res?.data?.driver?.phone}`;

                    this.alertSrv.sms({
                      icon: 'success',
                      title: res.message,
                      message: `Send delivery confirmation sms to ${route.end_name}`,
                      body: body,
                      phone: route.end_phone
                    });

                    this.modalCtrl.dismiss(true);

                    break;

                  }

                }

              }

            }

          }, err => {

            this.loadingSrv.hide();

            this.alertSrv.toast({
              icon: 'error',
              message: 'Slow connection! You need a good connection to complete this stop.',
              duration: 5000
            });

          });

      }

      else {

        this.apiSrv.arriveStop(formData)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              if (res.data.status == 4) {

                const route = res.data.routes[res.data.routes.length - 1];
                const date = new Date(route.arrived_at);
                var arrived_at = date.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                arrived_at = this.tConvert(arrived_at);

                var body = `Woohoo! Your Shef delivery was completed today at ${arrived_at}`;

                if( res?.data?.driver?.phone != '' && res?.data?.driver?.order_id != '')
                  body += ` , https://app.fariaslgx.com/where-is-my-order/${res?.data?.driver?.order_id}/${res?.data?.driver?.phone}`;

                this.alertSrv.sms({
                  icon: 'success',
                  title: res.message,
                  message: `Send delivery confirmation sms to ${route.end_name}`,
                  body: body,
                  phone: route.end_phone,
                  onConfirm: () => {

                    this.alertSrv.show({
                      icon: 'success',
                      message: 'All stops on this project have been completed.',
                      confirmButtonText: 'Go to Routes',
                      showCancelButton: false,
                      onConfirm: () => {
                        this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/routes`);
                      }
                    });

                  },
                  onCancel: () => {

                    this.alertSrv.show({
                      icon: 'success',
                      message: 'All stops on this project have been completed.',
                      confirmButtonText: 'Go to Routes',
                      showCancelButton: false,
                      onConfirm: () => {
                        this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/routes`);
                      }
                    });

                  }
                });

                this.modalCtrl.dismiss(true);

              }

              else {

                const length = res.data.routes.length;

                for (let index = length - 1; index >= 0; index--) {

                  const route = res.data.routes[index];

                  if (route.status == 2) {

                    const date = new Date(route.arrived_at);

                    var arrived_at = date.toLocaleTimeString(navigator.language, {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    arrived_at = this.tConvert(arrived_at);

                    var body = `Woohoo! Your Shef delivery was completed today at ${arrived_at}`

                    if( res?.data?.driver?.phone != '' && res?.data?.driver?.order_id != '')
                      body += ` , https://app.fariaslgx.com/where-is-my-order/${res?.data?.driver?.order_id}/${res?.data?.driver?.phone}`;

                    this.alertSrv.sms({
                      icon: 'success',
                      title: res.message,
                      message: `Send delivery confirmation sms to ${route.end_name}`,
                      body: body,
                      phone: route.end_phone
                    });

                    this.modalCtrl.dismiss(true);

                    break;

                  }

                }

              }

            }

          }, err => {

            this.loadingSrv.hide();

            this.alertSrv.toast({
              icon: 'error',
              message: 'Slow connection! You need a good connection to complete this stop.',
              duration: 5000
            });

          });

      }

    }

  }

  private tConvert(time: any) {
    var timeAr = time.split(":");
    time = timeAr[0] + ":" + timeAr[1];
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) // If time format correct
    {
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }

    return time.join(''); // return adjusted time or original string
  }

}
