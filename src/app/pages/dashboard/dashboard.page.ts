import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  public driver: any;

  public appPages = [
    { title: 'Home',      url: '/dashboard/home',     icon: 'home-outline',     disabled: false },
    { title: 'Report',    url: '/dashboard/report',   icon: 'reader-outline',   disabled: true  },
    { title: 'Settings',  url: '/dashboard/settings', icon: 'settings-outline', disabled: false }
  ];

  private unsubscribe$ = new Subject();

  constructor(
    private navCtrl: NavController,
    private apiSrv: ApiService,
    private driverSrv: DriverService
  ) { }

  ngOnInit() {
    this.checkDriverStatus();
    this.statusListener();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public logout() {
    this.apiSrv.logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
      }, err => {
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
      });
  }

  private checkDriverStatus() {
    this.driverSrv.getDriver()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(driver => {
        this.driver = driver;
          this.appPages.forEach(p => {
            if (p.url != '/dashboard/settings') {
              if (!driver.email || driver.status == 0) {
                p.disabled = true;
              }
              else {
                p.disabled = false;
              }
            }
          });
      });
  }

  private statusListener() {
    setInterval(() => {
      this.apiSrv.getStatus()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.driverSrv.setStatus(res.data);
        });
    }, 10000);
  }

}
