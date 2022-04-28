import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loading: boolean;

  public formGroup: FormGroup;

  private unsubscribe$ = new Subject();

  constructor(
    private apiSrv: ApiService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      user:     ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public login() {

    if (this.loading) return;

    if (this.formGroup.valid) {

      this.loading = true;

      this.apiSrv.login(this.formGroup.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.loading = false;
          this.navCtrl.navigateRoot('/dashboard');
        }, () => {
          this.loading = false;
        });

    }
    
  }

}
