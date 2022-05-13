import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  protected driverSubject: BehaviorSubject<any>;

  constructor() {
    this.driverSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('driver')));
  }

  public getDriver() {
    return this.driverSubject.asObservable();
  }

  public setDriver(driver: any) {
    localStorage.setItem('driver', JSON.stringify(driver));
    this.driverSubject.next(driver);
  }

  public setStatus(status: number) {
    const driver = this.driverSubject.value;
    driver.status = status;
    this.setDriver(driver);
  }

}
