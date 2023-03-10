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
import { ChooseMapComponent } from 'src/app/components/choose-map/choose-map.component';

const { Device, Geolocation } = Plugins;

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

  public device: any;

  public realtimePosition: any;

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

    Device.getInfo().then(info => this.device = info);

    Geolocation.watchPosition({
      enableHighAccuracy: true,
    }, (position, err) => {

      if (position) {

        if (this.realtimePosition) {

          this.realtimePosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        }

        else {

          this.realtimePosition = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            zIndex: 999,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#FFFFFF",
              fillOpacity: 0.8,
              strokeColor: '#EA4335',
              strokeWeight: 6
            }
          });

        }

      }
      
    });

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

      this.map.setZoom(15);

      this.markers[index].setZIndex(9999999999);

    });

  }

  public async moreInfo(index?: number) {

    const modal = await this.modalCtrl.create({
      component: MoreInfoComponent,
      componentProps: {
        data: {
          id:       index !== undefined ? this.project.routes[index].end_id       : this.project.driver.id,
          name:     index !== undefined ? this.project.routes[index].end_name     : this.project.driver.name,
          time:     index !== undefined ? this.project.routes[index].time         : this.project.driver.time,
          address:  index !== undefined ? this.project.routes[index].end_address  : this.project.routes[0].start_address,
          phone:    index !== undefined ? this.project.routes[index].end_phone    : null,
          image:    index !== undefined ? this.project.routes[index].image        : null,
          note:     index !== undefined ? this.project.routes[index].note         : null,
          bags:     index !== undefined ? this.project.routes[index].bags         : null,
          status:   index !== undefined ? this.project.routes[index].status       : null,
          order_id: index !== undefined ? this.project.routes[index].end_order_id : null,
          type:     index !== undefined ? 'stop' : 'driver'
        }
      }
    });

    return await modal.present();

  }

  public async directions(index?: number) {

    let address: string;

    let lat: string;

    let lng: string;

    if (index !== undefined) {

      address = this.project.routes[index].end_address;

      lat = this.project.routes[index].end_lat;

      lng = this.project.routes[index].end_lng;
    
    }

    else {

      address = this.project.routes[0].start_address;

      lat = this.project.routes[0].start_lat;

      lng = this.project.routes[0].start_lng;

    }

    const modal = await this.modalCtrl.create({
      component: ChooseMapComponent,
      swipeToClose: true,
      cssClass: 'choose-map',
      componentProps: {
        address: address,
        lat: lat,
        lng: lng,
        device: this.device
      }
    });

    return await modal.present();


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

              const message = `Hi there! Your Shef delivery is on the way and will arrive in approximately ${time} ${word}!`;

              this.apiSrv.sendSMSByFariasSMS(route.end_name, route.end_phone, message).toPromise();

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
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
          id: route.end_id,
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
          name: route.end_name,
          moreInfo: () => {
            this.moreInfo();
          }
        }
      }
    });

    return await modal.present();

  }

  private setTime() {

    let duration = 0;

    const split = this.project.driver.start_time.split(':');

    const date = new Date();

    date.setHours(Number(split[0]), Number(split[1]), 0, 0);

    this.project.driver.time = date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.project.routes.forEach((route: any) => {

      duration += route.duration;

      date.setHours(Number(split[0]), Number(split[1]), date.getSeconds() + duration, 0);

      route.time = date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      });

      duration += route.downtime;
      
    });

  }

  private setMarkers() {

    this.markers.forEach((marker: any) => {
      marker.setMap(null);
    });

    this.markers = [];

    const marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(this.project.routes[0].start_lat, this.project.routes[0].start_lng),
      zIndex: 99,
      icon: {
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
        fillColor: this.project.routes[0]?.status > 0 ? '#23BB34' : '#92949c',
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: '#FFFFFF',
        scale: 1.2,
        labelOrigin: new google.maps.Point(0, -29),
        anchor: new google.maps.Point(0, 0)
      }
    });

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', (() => this.slides.slideTo(0, 1000)));

    this.project.routes.forEach((route: any, index: number) => {

      let fillColor = '#92949c';

      if (route.status == 2) {
        fillColor = '#23BB34';
      }

      else if (route.status == 3) {
        fillColor = '#FF260A';
      }

      const marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(route.end_lat, route.end_lng),
        zIndex: (index + 1) * 9,
        icon: {
          path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
          fillColor: fillColor,
          fillOpacity: 1,
          strokeWeight: 1.5,
          strokeColor: '#FFFFFF',
          scale: 1.2,
          labelOrigin: new google.maps.Point(0, -29),
          anchor: new google.maps.Point(0, 0)
        },
        label: {
          text: String(index + 1),
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '500'
        }
      });

      this.markers.push(marker);

      google.maps.event.addListener(marker, 'click', (() => this.slides.slideTo(index + 1, 1000)));

    });

  }

  private setPolyline() {

    this.polyline.forEach(line => {
      line.setMap(null);
    });

    this.polyline = [];

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
      zoom: 15,
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
