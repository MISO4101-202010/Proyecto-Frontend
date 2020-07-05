import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(protected http: HttpClient) { }

  getHeaders(contentType, typeMethod) {
      if (typeMethod === 'post') {
      return new HttpHeaders({
        'Content-Type' : contentType
      });
    } else {
      return new HttpHeaders();
    }

  }

  postJSON(url, data): Observable<HttpResponse<string>> {
    return this.http.post<string>(url, data,
        {
          headers: this.getHeaders('application/json', 'post'),
          observe: 'response'
        }
    );
  }

  getRequestWithoutParams(url): Observable<any> {
    return this.http.get(url, {
      headers: this.getHeaders('application/json', 'get'),
      observe: 'response'
    });
  }

  delete(url): Observable<any> {
    return this.http.delete(url, {
      headers: this.getHeaders('application/json', 'delete'),
      observe: 'response'
    });
  }

  getRequestWithParams(url, data): Observable<any> {
    return this.http.get(url + '?' + this.listParams(data),
    {
      headers: this.getHeaders('application/json', 'get'),
      observe: 'response'
    });
  }

  listParams(data) {
    if (data === '') {
        return '';
    } else {
        return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
    }
  }

}
