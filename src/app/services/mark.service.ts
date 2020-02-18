import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkService{

  private headers: HttpHeaders;
  private URL_HOST: string = `${environment.apiUrl}`;
  private userToken: string;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain'});
  }

  getAllMarkers(): Observable<any> {
    // Cuando se implemente login validar aquí el token para que se hagala redirección correctamente
    // const signedIn = !!this.userToken;
    return this.http.get(this.URL_HOST + '/activities/marca');
  }

  getMarkersFromContent(contentId): Observable<any> {
    return this.http.get(this.URL_HOST + '/activities/marca?contenido=' + contentId);
  }
}
