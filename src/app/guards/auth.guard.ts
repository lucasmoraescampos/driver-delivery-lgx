import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    
    constructor(private navCtrl: NavController) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            return true;
        }

        this.navCtrl.navigateRoot('/login');
        
        return false;

    }
}