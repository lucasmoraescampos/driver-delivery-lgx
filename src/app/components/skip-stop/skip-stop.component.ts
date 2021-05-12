import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    private apiSrv: ApiService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeOption(ev: any) {
    if (ev.detail.value == 1) {
      this.note = 'Nobody home';
    }
    else if (ev.detail.value == 2) {
      this.note = 'Nobody home';
    }
    else {
      this.note = '';
    }
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

            this.alertSrv.toast({
              icon: 'success',
              message: res.message
            });

            this.modalCtrl.dismiss();

          }

        });

    }

  }

}
