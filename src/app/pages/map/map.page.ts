import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Plugins } from '@capacitor/core';
import { MoreInfoComponent } from 'src/app/components/more-info/more-info.component';
import { ArriveStopComponent } from 'src/app/components/arrive-stop/arrive-stop.component';
import { SkipStopComponent } from 'src/app/components/skip-stop/skip-stop.component';
import { AlertService } from 'src/app/services/alert.service';
import { TabsService } from 'src/app/services/tabs.service';

const { Browser } = Plugins;

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  @ViewChild(IonSlides) slides: IonSlides;

  public project: any;

  private map: any;

  public options = {
    slidesPerView: 3,
    spaceBetween: 16,
  }

  private markers: any[] = [];

  private polyline: any[] = [];

  private unsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private apiSrv: ApiService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private tabsSrv: TabsService
  ) { }

  ngOnInit() {

    this.apiSrv.setProjectHash(this.route.snapshot.paramMap.get('route'));

    this.initMap();

    this.initProject();

    this.apiSrv.project.pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {

        if (project) {

          this.project = project;
          
          this.setTime();

          this.setMarkers();

          this.setPolyline();

          setTimeout(() => this.centerMap());

        }

      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewWillEnter() {
    this.tabsSrv.setTabIndex(1);
  }

  public slideChanged(ev: any) {

    ev.target.getActiveIndex().then((index: number) => {

      this.markers.forEach((marker, i) => {
        marker.setZIndex((i + 1) * 9);
      });

      this.map.panTo(this.markers[index].position);

      this.markers[index].setZIndex(9999999999);

    });

  }

  public async moreInfo(index?: number) {

    const modal = await this.modalCtrl.create({
      component: MoreInfoComponent,
      componentProps: {
        data: {
          name:     index !== undefined ? this.project.routes[index].end_name     : this.project.driver.name,
          time:     index !== undefined ? this.project.routes[index].time         : this.project.driver.start_time,
          address:  index !== undefined ? this.project.routes[index].end_address  : this.project.driver.start_address,
          phone:    index !== undefined ? this.project.routes[index].end_phone    : null,
          image:    index !== undefined ? this.project.routes[index].image        : null,
          note:     index !== undefined ? this.project.routes[index].note         : null,
          bags:     index !== undefined ? this.project.routes[index].bags         : null,
          status:   index !== undefined ? this.project.routes[index].status       : null,
          order_id: index !== undefined ? this.project.routes[index].end_order_id : null,
        }
      }
    });

    return await modal.present();

  }

  public directions(index?: number) {

    if (index === undefined) {

      const driver = this.project.driver;

      Browser.open({ url: `https://www.google.com/maps/dir//${driver.start_address}/@${driver.start_lat},${driver.start_lng}` });
    
    }

    else {

      const stop = this.project.routes[index];
      
      Browser.open({ url: `https://www.google.com/maps/dir//${stop.end_address}/@${stop.end_lat},${stop.end_lng}` });
    
    }

  }

  public startStop() {

    this.loadingSrv.show();

    this.apiSrv.startStop()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          for (let i = 0; i < this.project.routes.length; i++) {

            if (this.project.routes[i].status == 1) {

              const route = this.project.routes[i];

              const time = Math.round(route.duration / 60);

              const word = time > 1 ? 'minutes' : 'minute';

              this.alertSrv.sms({
                icon: 'success',
                title: res.message,
                message: `Send an sms to ${route.end_name} to let him know that your delivery is on its way`,
                body: `Hi there! Your Shef delivery is on the way and will arrive in approximately ${time} ${word}!`,
                phone: route.end_phone
              });

              if (route.end_id == this.project.routes[0].end_id) {
                this.slides.slideNext();
              }

              break;

            }

          }

        }

      });

  }

  public async arrive(route: any) {

    const modal = await this.modalCtrl.create({
      component: ArriveStopComponent,
      componentProps: {
        data: {
          name: route.end_name,
          moreInfo: () => {
            this.moreInfo();
          }
        }
      }
    });

    return await modal.present();
 
  }

  public async skip(route: any) {

    const modal = await this.modalCtrl.create({
      component: SkipStopComponent,
      componentProps: {
        data: {
          name: route.end_name
        }
      }
    });

    return await modal.present();

  }

  private setTime() {

    let duration = 0;

    const split = this.project.driver.start_time.split(':');

    const date = new Date();

    this.project.routes.forEach((route: any) => {

      duration += route.duration;

      date.setHours(Number(split[0]), Number(split[1]), 0, 0);

      date.setSeconds(date.getSeconds() + duration);

      route.time = date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      });

      duration += route.downtime;
      
    });

  }

  private setMarkers() {

    const marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(this.project.driver.start_lat, this.project.driver.start_lng),
      zIndex: 999
    });

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', (() => this.slides.slideTo(0, 1000)));

    this.project.routes.forEach((route: any, index: number) => {

      const marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(route.end_lat, route.end_lng),
        zIndex: (index + 1) * 9,
        label: {
          text: String(index + 1),
          color: '#FFFFFF'
        }
      });

      this.markers.push(marker);

      google.maps.event.addListener(marker, 'click', (() => this.slides.slideTo(index + 1, 1000)));

    });

  }

  private setPolyline() {

    this.project.polyline_points.forEach((polyline: any) => {

      const path = google.maps.geometry.encoding.decodePath(polyline);

      this.polyline.push(new google.maps.Polyline({
        map: this.map,
        path: path,
        strokeColor: '#0088FF',
        strokeOpacity: 0.7,
        strokeWeight: 5
      }));

    });

  }

  private centerMap() {

    if (this.project.status == 0) {

      this.map.panTo(this.markers[0].position);

    }

    else if (this.project.status == 1) {

      const length = this.project.routes.length;

      for (let index = length - 1; index >= 0; index--) {

        const route = this.project.routes[index];

        if (route.status == 1) {

          this.slides.slideTo(index + 1, 1000);

          break;

        }

        else if (route.status == 2 || route.status == 3) {

          this.slides.slideTo(index + 2, 1000);

          break;
          
        }

      }

    }

    else {

      this.slides.slideTo(this.markers.length, 1000);

    }

  }

  private initMap() {

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {
        lat: 37.33772,
        lng: -121.88741
      },
      zoom: 11,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

  }

  private initProject() {

    this.loadingSrv.show();

    this.apiSrv.getProject()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.project = res.data;

          this.setTime();

          this.setMarkers();

          this.setPolyline();

          setTimeout(() => this.centerMap());

        }

      });

  }

}
