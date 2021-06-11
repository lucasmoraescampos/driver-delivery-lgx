import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  private tabsSubject = new BehaviorSubject<0 | 1 | 2>(0);

  public tabActiveIndex = this.tabsSubject.asObservable();

  constructor() { }

  public setTabIndex(index: 0 | 1 | 2) {
    this.tabsSubject.next(index);
  }

}
