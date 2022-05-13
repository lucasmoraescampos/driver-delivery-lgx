import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { DriverService } from 'src/app/services/driver.service';

const { Camera, Device } = Plugins;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public loading: boolean;

  public driver: any;

  public slideActiveIndex: number = 0;

  public webUseInput: boolean;

  public formGroup: FormGroup;

  public license: string;

  public insurance: string;

  public password: string;

  public confirmPassword: string;

  private unsubscribe$ = new Subject();

  constructor(
    private driverSrv: DriverService,
    private apiSrv: ApiService,
    private formBuilder: FormBuilder,
    private alertSrv: AlertService,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit() {

    Device.getInfo().then(device => this.webUseInput = device.platform === 'web');

    this.driverSrv.getDriver()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(driver => {

        this.driver = driver;

        this.formGroup = this.formBuilder.group({
          name: [this.driver.name, Validators.required],
          email: [this.driver.email, Validators.required],
          phone: [this.driver.phone.slice(1), Validators.required]
        });

      });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public slideChanged(ev: any) {
    this.slideActiveIndex = ev.target.swiper.activeIndex;
  }

  public async chooseLicense() {

    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      webUseInput: this.webUseInput
    });

    this.license = await this.imageCompress.compressFile(image.dataUrl, 0, 50, 50);

    this.driver.license = this.license;

  }

  public async chooseInsurance() {

    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      webUseInput: this.webUseInput
    });

    this.insurance = await this.imageCompress.compressFile(image.dataUrl, 0, 50, 50);

    this.driver.insurance = this.insurance;

  }

  public save() {

    let data: any;

    if (this.slideActiveIndex == 1) {

      data = { ...this.formGroup.value };

      data.phone = `1${data.phone}`;

    }

    else if (this.slideActiveIndex == 2) {

      data = new FormData();

      data.append('license', UtilsHelper.base64toBlob(this.license));

    }

    else if (this.slideActiveIndex == 3) {

      data = new FormData();

      data.append('insurance', UtilsHelper.base64toBlob(this.insurance));

    }

    else if (this.slideActiveIndex == 4) {

      if (this.password == this.confirmPassword) {
        data = { password: this.password };
      }
      else {
        this.alertSrv.toast({
          icon: 'error',
          message: 'The passwords are different'
        });
      }

    }

    this.loading = true;

    this.apiSrv.update(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.loading = false;
        this.driver = res.data;
        this.slides.slideTo(0);
        this.alertSrv.toast({
          icon: 'success',
          message: res.message
        });
      }, () => {
        this.loading = false;
      });

  }

}
