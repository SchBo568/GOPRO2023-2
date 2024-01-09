import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserDto } from '../app/models/UpdateUserDto';
import { ResponseStatus } from '../app/models/ResponseStatus';
import { UserSession } from '../app/models/UserSession';
import { GetKiosks } from '../app/models/GetKiosks';
import { GetCategories } from '../app/models/GetCategories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://64.226.82.238:3000/categories'; // Setze hier deine API-Basis-URL ein

  constructor(private http: HttpClient) {}

  getCategories(): Observable<GetCategories[]> {
    return this.http.get<any>(`${this.apiUrl}`, {});
  }

}