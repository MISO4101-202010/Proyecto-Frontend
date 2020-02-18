import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class InterativeContentService {

  constructor(private httpService: HttpService) { }

  postGeneric(url, data): Observable<any> {
    return this.httpService.postJSON(url, data).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  getGeneric(url, data): Observable<any> {
    return this.httpService.getRequestWithParams(url, data).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

}
