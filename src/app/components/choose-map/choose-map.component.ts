import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';

const { Browser } = Plugins;

@Component({
  selector: 'app-choose-map',
  templateUrl: './choose-map.component.html',
  styleUrls: ['./choose-map.component.scss'],
})
export class ChooseMapComponent implements OnInit {

  @Input() address: string;
  @Input() lat    : string;
  @Input() lng    : string;
  @Input() device : any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.device)
  }

  public apple() {
    Browser.open({ url: `maps://maps.apple.com/?q=${this.address}&sll=${this.lat},${this.lng}` });
    this.modalCtrl.dismiss();
  }

  public google() {
    //Browser.open({ url: `https://www.google.com/maps/dir//${this.address}/@${this.lat},${this.lng}` });
    //Browser.open({ url: `https://www.google.com/maps/search/?api=1&query=${this.lat},${this.lng}` });
    Browser.open({ url: `https://www.google.com/maps?daddr=${this.address}&ll=${this.lat},${this.lng}` });
    this.modalCtrl.dismiss();
  }

  public waze() {
    Browser.open({ url: `https://waze.com/ul?q=${this.address}&ll=${this.lat},${this.lng}` });
    //Browser.open({ url: `https://waze.com/ul?q=&ll=${this.lat},${this.lng}` });
    this.modalCtrl.dismiss();
  }

}
