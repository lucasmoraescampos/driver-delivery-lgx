import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigHelper } from 'src/app/helpers/config.helper';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit, OnDestroy {

  public projects: any[];

  private unsubscribe = new Subject();

  constructor(
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private navCtrl: NavController,
    private tabsSrv: TabsService
  ) { }

  ngOnInit() {
    
    this.initProjects();

    this.apiSrv.project.pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {

        if (data) {

          this.projects.forEach(project => {
            if (project.hash == data.hash) {
              project.routes = data.routes;
            }
          });

        }

      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewWillEnter() {
    this.tabsSrv.setTabIndex(0);
  }

  public stops(project_hash: string) {
    this.navCtrl.navigateForward(`/${localStorage.getItem(ConfigHelper.Storage.DriverHash)}/stops/route/${project_hash}`);
  }

  public progress(project: any) {

    let completed = 0;

    project.routes.forEach((route: any) => {
      if (route.status >= 2) {
        completed++;
      }
    });

    return completed / project.routes.length;

  }

  private initProjects() {

    this.loadingSrv.show();

    this.apiSrv.getProjects()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.projects = res.data;
        }

      });

  }

}
