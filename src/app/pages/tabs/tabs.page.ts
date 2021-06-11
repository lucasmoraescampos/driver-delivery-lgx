import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { ApiService } from 'src/app/services/api.service';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  public tabActiveIndex: number;

  private unsubscribe = new Subject();

  constructor(
    private navCtrl: NavController,
    private apiSrv: ApiService,
    private route: ActivatedRoute,
    private tabsSrv: TabsService
  ) {

  }

  ngOnInit() {

    this.apiSrv.setDriverHash(this.route.snapshot.paramMap.get('driver'));

    this.tabsSrv.tabActiveIndex.pipe(takeUntil(this.unsubscribe)).subscribe(index => this.tabActiveIndex = index);

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public routes() {
    const driverHash = localStorage.getItem(ConfigHelper.Storage.DriverHash);
    this.navCtrl.navigateRoot(`/${driverHash}/routes`);
  }

  public map() {
    const driverHash = localStorage.getItem(ConfigHelper.Storage.DriverHash);
    const routeHash = localStorage.getItem(ConfigHelper.Storage.ProjectHash);
    this.navCtrl.navigateRoot(`/${driverHash}/map/route/${routeHash}`);
  }

  public stops() {
    const driverHash = localStorage.getItem(ConfigHelper.Storage.DriverHash);
    const routeHash = localStorage.getItem(ConfigHelper.Storage.ProjectHash);
    this.navCtrl.navigateRoot(`/${driverHash}/stops/route/${routeHash}`);
  }

}
