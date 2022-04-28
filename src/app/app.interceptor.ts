import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        private navCtrl: NavController,
        private loadingSrv: LoadingService,
        private alertSrv: AlertService
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {

        this.loadingSrv.hide();

        if (err.status == 400) {
            this.alertSrv.toast({
                icon: 'error',
                message: err.error.message
            });
        }

        else if (err.status == 401) {
            localStorage.clear();
            this.navCtrl.navigateRoot('/login');
        }

        else if (err.status == 404) {
            localStorage.clear();
            this.navCtrl.navigateRoot('/not-found');
        }

        else if (err.status == 422) {
            const key = Object.keys(err.error.message)[0];
            this.alertSrv.toast({
                icon: 'error',
                message: err.error.message[key][0]
            });
        }

        return throwError(err);

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loadingSrv.show();

        const token = localStorage.getItem('access_token');

        if (request.url == 'https://api.nexmo.com/v0.1/messages') {

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${environment.nexmoKey}`
                }
            });

        }

        else if (token != null) {

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

        }

        return next.handle(request)
            .pipe(catchError(err => this.handleAuthError(err)))
            .pipe(finalize(() => this.loadingSrv.hide()));

    }
}