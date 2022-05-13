import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  public formGroup: FormGroup;

  public eye: boolean;

  public loading: boolean;

  private unsubscribe$ = new Subject();

  constructor(
    private apiSrv: ApiService,
    private driverSrv: DriverService,
    private formBuilder: FormBuilder,
    private alertSrv: AlertService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public save() {

    if (this.loading) return;

    if (this.formGroup.valid) {

      if (!UtilsHelper.validateEmail(this.formControl.email.value)) {

        this.alertSrv.toast({
          icon: 'error',
          message: 'Enter a valid email address'
        });

      }

      else if (isNaN(this.formControl.phone.value)) {

        this.alertSrv.toast({
          icon: 'error',
          message: 'Enter a valid phone number'
        });

      }

      else {

        this.loading = true;

        const data = { ...this.formGroup.value };

        data.phone = `1${data.phone}`;

        this.apiSrv.register(data)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(res => {
            this.loading = false;
            this.driverSrv.setDriver(res.data.driver);
            this.navCtrl.navigateRoot('/dashboard');
          }, () => {
            this.loading = false;
          });

      }

    }

  }

}
