import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserDto } from '../app/models/UpdateUserDto';
import { ResponseStatus } from '../app/models/ResponseStatus';
import { UserSession } from '../app/models/UserSession';
import { GetKiosks } from '../app/models/GetKiosks';

@Injectable({
  providedIn: 'root'
})
export class KioskService {
  private apiUrl = 'http://64.226.82.238:3000/kiosks'; // Setze hier deine API-Basis-URL ein

  constructor(private http: HttpClient) {}

  getKiosks(): Observable<GetKiosks[]> {
    return this.http.get<any>(`${this.apiUrl}`, {});
  }

}
