import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        private navCtrl: NavController
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {

        if (err.status === 404) {

            localStorage.clear();

            this.navCtrl.navigateRoot('/not-found');

            return of(err.message);

        }

        return throwError(err);

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => this.handleAuthError(err)));
    }
}