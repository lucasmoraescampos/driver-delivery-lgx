import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-balance-resume',
  templateUrl: './balance-resume.component.html',
  styleUrls: ['./balance-resume.component.scss'],
})
export class BalanceResumeComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  public dismiss() {
    this.modalCtrl.dismiss();
  }

}
