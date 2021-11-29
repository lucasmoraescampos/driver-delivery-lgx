import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AlertService } from 'src/app/services/alert.service';
import { ArriveStopComponent } from '../arrive-stop/arrive-stop.component';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent implements OnInit {

  @Input() data: any;

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() { }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async phoneOptions() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Call',
        icon: 'call-outline',
        handler: () => {

          const a = document.createElement('a');

          a.setAttribute('href', `tel:${this.data.phone}`);

          a.click();

        }
      }, {
        text: 'SMS',
        icon: 'chatbubble-outline',
        handler: () => {

          const a = document.createElement('a');

          a.setAttribute('href', `sms:${this.data.phone}`);

          a.click();

        }
      }, {
        text: 'Copy',
        icon: 'copy-outline',
        handler: () => {

          Clipboard.write({ string: this.data.phone });

          this.alertSrv.toast({
            icon: 'success',
            message: 'Successfully copied'
          });

        }
      }]
    });

    await actionSheet.present();

  }

  public async changeStatus() {

    const modal = await this.modalCtrl.create({
      component: ArriveStopComponent,
      componentProps: {
        data: this.data
      }
    });

    modal.onDidDismiss()
      .then(res => {
        if (res.data) {
          this.data.status = 2;
        }
      });

    return await modal.present();

  }

}
