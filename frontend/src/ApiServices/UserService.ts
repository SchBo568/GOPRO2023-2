import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserDto } from '../app/models/UpdateUserDto';
import { ResponseStatus } from '../app/models/ResponseStatus';
import { UserSession } from '../app/models/UserSession';
import { CreateUserDto } from '../app/models/CreateUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://64.226.82.238:3000/users'; // Setze hier deine API-Basis-URL ein
  private token = ''; // Füge hier deinen Bearer-Token ein

  public setToken(token: string):void {
    this.token = token
    console.log("Token in Api: "+ this.token)
  }

  constructor(private http: HttpClient) {}

  // Funktion, um die HttpHeaders mit dem Bearer-Token zu erstellen
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  login(username: string, password: string) : Observable<UserSession> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, {username: username, password: password});
  }

  register(user: CreateUserDto): Observable<ResponseStatus> {
    return this.http.post<any>(`${this.apiUrl}/register`, {user})
  }

  updatePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getHeaders();
    console.log("Headers: "+headers.get+"; Username: "+username+"; Old Password: "+oldPassword+"; New Password: "+newPassword)
    return this.http.put<any>(`${this.apiUrl}/updatePassword`, {username, oldPassword, newPassword}, { headers });
  }

  updateUser(username: string, userDetails: UpdateUserDto): Observable<ResponseStatus> {
    const headers = this.getHeaders();
    console.log(username, userDetails)
    console.log(this.http.put<any>(`${this.apiUrl}/updateUser`, {username, userDetails}, { headers }))
    return this.http.put<any>(`${this.apiUrl}/updateUser`, {username, userDetails}, { headers });
  }

}
