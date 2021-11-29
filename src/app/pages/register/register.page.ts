import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public formGroup: FormGroup;

  private unsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    // Init all plugins...
    const current = this;

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public save() {

    if (this.formGroup.valid) {

      if (!UtilsHelper.validateEmail(this.formControl.email.value)) {

        this.alertSrv.toast({
          icon: 'error',
          message: 'Enter a valid email address'
        });

      }

      else {

        this.loadingSrv.show();

      }

    }

  }

}
