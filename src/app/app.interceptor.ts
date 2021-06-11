import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';

const { Network } = Plugins;

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        private navCtrl: NavController,
        private loadingSrv: LoadingService,
        private alertSrv: AlertService
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {

        if (err.status === 404) {

            localStorage.clear();

            this.navCtrl.navigateRoot('/not-found');

            return of(err.message);

        }

        else {

            Network.getStatus().then(status => {

                this.loadingSrv.clear();

                if (status.connected == false) {

                    this.alertSrv.toast({
                        icon: 'error',
                        message: 'You are offline!'
                    });

                    return of(err.message);
    
                }

                else {

                    this.alertSrv.toast({
                        icon: 'error',
                        message: 'Unable to complete your request, please contact support!'
                    });

                    return throwError(err);

                }

            });

        }

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => this.handleAuthError(err)));
    }
}