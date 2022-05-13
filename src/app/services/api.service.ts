import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public driverHash = localStorage.getItem(ConfigHelper.Storage.DriverHash);

  public projectHash = localStorage.getItem(ConfigHelper.Storage.ProjectHash);

  private apiUrl = environment.apiUrl;

  private projectSubject = new BehaviorSubject<any>(null);

  public project = this.projectSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public login(data: any) {
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/login`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem('access_token', res.data.token);
        }
        return res;
      }));
  }

  public logout() {
    const token = localStorage.getItem('access_token');
    return this.http.post<HttpResult>(`${this.apiUrl}/user/logout`, { token })
      .pipe(map(res => {
        if (res.success) {
          localStorage.clear();
        }
        return res;
      }));
  }

  public register(data: any) {
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/register`, data)
      .pipe(map(res => {
        if (res.success) {
          localStorage.setItem('access_token', res.data.token);
        }
        return res;
      }));
  }

  public update(data: any) {
    if (data instanceof FormData) {
      data.append('_method', 'put');
    }
    else {
      data._method = 'put';
    }
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/update`, data);
  }

  public getStatus() {
    return this.http.get<HttpResult>(`${this.apiUrl}/driver/status`);
  }

  public getProjects() {
    return this.http.get<HttpResult>(`${this.apiUrl}/driver/${this.driverHash}/projects`);
  }

  public getProject() {
    return this.http.get<HttpResult>(`${this.apiUrl}/driver/${this.driverHash}/project/${this.projectHash}`);
  }

  public startStop() {
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/project/start`, {
      driver_hash: this.driverHash,
      project_hash: this.projectHash
    }).pipe(map(res => {
      if (res.success) {
        this.projectSubject.next(res.data);
      }
      return res;
    }));
  }

  public arriveStop(data: FormData) {

    data.append('driver_hash', this.driverHash);

    data.append('project_hash', this.projectHash);

    return this.http.post<HttpResult>(`${this.apiUrl}/driver/project/arrive`, data)
      .pipe(map(res => {
        if (res.success) {
          this.projectSubject.next(res.data);
        }
        return res;
      }));
  }

  public skipStop(note?: string) {
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/project/skip`, {
      driver_hash: this.driverHash,
      project_hash: this.projectHash,
      note: note
    }).pipe(map(res => {
      if (res.success) {
        this.projectSubject.next(res.data);
      }
      return res;
    }));
  }

  public changeStatus(stop_id: number, data: FormData) {

    data.append('driver_hash', this.driverHash);

    data.append('project_hash', this.projectHash);

    return this.http.post<HttpResult>(`${this.apiUrl}/driver/project/status/${stop_id}`, data)
      .pipe(map(res => {
        if (res.success) {
          this.projectSubject.next(res.data);
        }
        return res;
      }));
  }

  public setDriverHash(driverHash: string) {
    this.driverHash = driverHash;
    localStorage.setItem(ConfigHelper.Storage.DriverHash, driverHash);
  }

  public setProjectHash(projectHash: string) {
    this.projectHash = projectHash;
    localStorage.setItem(ConfigHelper.Storage.ProjectHash, projectHash);
  }

  public sendSMSByFariasSMS(name: string, target: string, message: string) {
    return this.http.post<HttpResult>('https://sms.fariaslgx.com/api/queue', { name, target, message });
  }

  public sendSMSByNexmoAPI(phone: string, message: string) {
    return this.http.post<HttpResult>(`${this.apiUrl}/driver/send-sms`, { phone, message });
  }

  public report(params: any) {
    return this.http.get<HttpResult>(`${this.apiUrl}/driver/report`, { params: params });
  }

  public reportDetails(params: any) {
    return this.http.get<HttpResult>(`${this.apiUrl}/driver/report/details`, { params: params });
  }

}
