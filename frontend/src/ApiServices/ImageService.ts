import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetToolPictureDto } from "../app/models/GetToolPicture";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://64.226.82.238:3000/tool-pictures';
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

  uploadFile(file: File, toolId: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/upload/${toolId}`, formData, {headers});
  }

  getImage(imageUrl: string): Observable<Blob> {
    const apiUrl = 'http://64.226.82.238:3000/tool-pictures/download';
    const requestBody = { imageUrl }; // Assuming imageName is the property expected by the backend
    return this.http.post(apiUrl, requestBody, { responseType: 'blob' });
  }

  async getPicturesByToolId(toolId: number): Promise<Observable<GetToolPictureDto[]>> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/tool/${toolId}`, {headers});
  }


}
