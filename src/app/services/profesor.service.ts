import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private profesorUrl = `${environment.apiUrl}/users/profesores/`;

  constructor(private httpClient: HttpClient) { }

  getProfesor(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.profesorUrl}${id}/`);
  }
}
