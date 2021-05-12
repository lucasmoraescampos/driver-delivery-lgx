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

  public note: string;

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
    this.modalCtrl.dismiss();
  }

  public moreInfo() {
    this.data.moreInfo();
  }

  public confirm() {
    this.alertSrv.show({
      icon: 'warning',
      message: 'Submit a confirmation photo',
      confirmButtonText: '<ion-icon slot="start" name="camera"></ion-icon> Get Photo',
      onConfirm: () => {
        this.getPhoto();
      }
    });
  }

  private async getPhoto() {

    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      webUseInput: this.webUseInput
    });

    const allowTypes = ['gif', 'png', 'jpeg', 'bmp', 'webp'];

    if (allowTypes.indexOf(image.format) == -1) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'O arquivo enviado não é uma imagem'
      });

    }

    else if (image.dataUrl.length > 8000000) {
      
      this.alertSrv.toast({
        icon: 'error',
        message: 'A imagem enviada deve ter no máximo 8 MB'
      });

    }

    else {

      this.loadingSrv.show();

      this.apiSrv.completeStop(image.dataUrl, this.note)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {

          this.loadingSrv.hide();

          if (res.success) {

            if (res.data.status == 2) {

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

            else {

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

            this.modalCtrl.dismiss();

          }

        });

    }

  }

}
