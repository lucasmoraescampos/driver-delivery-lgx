import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })

export class DriverStatusGuard implements CanActivate {

    constructor(private navCtrl: NavController) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const driver = JSON.parse(localStorage.getItem('driver'));

        if (driver && driver.email && driver.status != 0) {
            return true;
        }

        this.navCtrl.navigateRoot('/dashboard/settings');
        
        return false;

    }
}