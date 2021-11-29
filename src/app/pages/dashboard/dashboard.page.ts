import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public appPages = [
    { title: 'Home',      url: '/dashboard/home',     icon: 'home-outline' },
    { title: 'Report',    url: '/dashboard/report',   icon: 'reader-outline' },
    { title: 'Settings',  url: '/dashboard/settings', icon: 'settings-outline' }
  ];

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  public logout() {
    this.navCtrl.navigateRoot('/login');
  }

}
