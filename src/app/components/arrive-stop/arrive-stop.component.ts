import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfigHelper } from 'src/app/helpers/config.helper';

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

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private navCtrl: NavController
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

  public confirm() {

    if (this.option && !this.bags) {
        
      this.alertSrv.toast({
        icon: 'error',
        message: 'Enter the number of bags collected'
      });

    }

    else {

      this.alertSrv.chooseImage({
        icon: 'warning',
        title: 'Submit a confirmation photo',
        confirmButtonText: this.webUseInput ? 'Choose Image' : 'Open Camera',
        onConfirm: () => {
          this.getPhoto();
        }
      });

    }
    
  }

  private async getPhoto() {

    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      webUseInput: this.webUseInput
    });

    const allowTypes = ['gif', 'png', 'jpeg', 'bmp', 'webp'];

    if (allowTypes.indexOf(image.format) == -1) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'The uploaded file is not an image'
      });

    }

    else if (image.dataUrl.length > 8000000) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'The uploaded image must have a maximum of 8 MB'
      });

    }

    else {

      this.loadingSrv.show();

      const data: any = {
        image: image.dataUrl,
        bags: this.option ? this.bags : null,
        note: this.note
      } 

      this.apiSrv.arriveStop(data)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            if (res.data.status == 4) {

              const route = res.data.routes[res.data.routes.length - 1];

              this.alertSrv.sms({
                icon: 'success',
                title: res.message,
                message: `Send delivery confirmation sms to ${route.end_name}`,
                body: `Woohoo! Your Shef delivery was completed today at ${route.arrived_at.slice(11, 16)}${route.arrived_at.slice(19)}`,
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

                  this.alertSrv.sms({
                    icon: 'success',
                    title: res.message,
                    message: `Send delivery confirmation sms to ${route.end_name}`,
                    body: `Woohoo! Your Shef delivery was completed today at ${route.arrived_at.slice(11, 16)}${route.arrived_at.slice(19)}`,
                    phone: route.end_phone
                  });

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
