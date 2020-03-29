import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private cursoUrl = `${environment.apiUrl}/content/courses/`;
  private cursosEstudianteUrl = `${environment.apiUrl}/content/mycourses/`;

  constructor(private httpClient: HttpClient) { }

  getCursos(): Observable<any> {
    return this.httpClient.get<any>(this.cursoUrl);
  }

  getCursosDisponibles(contenidoId): Observable<any> {
    return this.httpClient.get<any>(`${this.cursoUrl}${contenidoId}`);
  }

  getCursosEstudiante(): Observable<any> {
    return this.httpClient.get<any>(this.cursosEstudianteUrl);
  }
}
