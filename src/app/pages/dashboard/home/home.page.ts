import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BalanceResumeComponent } from 'src/app/components/balance-resume/balance-resume.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  public async balanceResume() {

    const modal = await this.modalCtrl.create({
      component: BalanceResumeComponent
    });

    return await modal.present();

  }

}
