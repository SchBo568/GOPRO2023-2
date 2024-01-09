import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserDto } from '../app/models/UpdateUserDto';
import { ResponseStatus } from '../app/models/ResponseStatus';
import { UserSession } from '../app/models/UserSession';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://64.226.82.238:3000/auth'; // Setze hier deine API-Basis-URL ein

  constructor(private http: HttpClient) {}

  login(username: string, password: string) : Observable<UserSession> {
    return this.http.post<any>(`${this.apiUrl}/login`, {username: username, password: password});
  }

}
