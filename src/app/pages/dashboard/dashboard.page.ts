import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  public appPages = [
    { title: 'Home',      url: '/dashboard/home',     icon: 'home-outline',     disabled: false },
    { title: 'Report',    url: '/dashboard/report',   icon: 'reader-outline',   disabled: true  },
    { title: 'Settings',  url: '/dashboard/settings', icon: 'settings-outline', disabled: false }
  ];

  private unsubscribe$ = new Subject();

  constructor(
    private navCtrl: NavController,
    private apiSrv: ApiService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {
    this.checkDriverStatus();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public logout() {
    this.loadingSrv.show();
    this.apiSrv.logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.loadingSrv.hide();
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
      }, err => {
        this.loadingSrv.hide();
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
      });
  }

  private checkDriverStatus() {
    const driver = JSON.parse(localStorage.getItem('driver'));
    if (!driver.email || driver.status == 0) {
      this.appPages.forEach(p => {
        if (p.url != '/dashboard/settings') {
          p.disabled = true;
        }
      });
    }
  }

}
