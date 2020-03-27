import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/services/http-service/http.service';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AnswerQuestion} from 'src/app/models/mark/answerQuestion.model';
import { AnswerVoF } from 'src/app/models/mark/answerVoF';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  private activitiesUrl = `${environment.apiUrl}/activities/`;

  constructor(private httpService: HttpService) {
  }

  getActivityById(id): Observable<any> {
    const url = this.activitiesUrl + 'preguntaOpcionMultiple/' + id + '/';
    return this.httpService.getRequestWithoutParams(url).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  getActivityFVById(id): Observable<any> {
    const url = this.activitiesUrl + 'pregunta_f_v/' + id;
    return this.httpService.getRequestWithoutParams(url).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  getMarcaById(id): Observable<any> {
    const url = this.activitiesUrl + 'marca';
    const data = {
      contenido: id
    };
    return this.httpService.getRequestWithParams(url, data).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  postSaveAnswerQuestion(answer: AnswerQuestion): Observable<any> {
    const url = this.activitiesUrl + 'respuestaOpcionMultiple/';
    return this.httpService.postJSON(url, answer).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  postFVAnswer(answer: AnswerVoF): Observable<any> {
    const url = this.activitiesUrl + 'respuestafov/';
    return this.httpService.postJSON(url, answer).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

  getLastTryByQuestion(idQuestion, idStudent): Observable<any> {
    const url = this.activitiesUrl + 'ultimo_intento';
    const data = {
      id_pregunta: idQuestion,
      id_estudiante: idStudent
    };
    return this.httpService.getRequestWithParams(url, data).map(
      response => {
        return response;
      }, error => {
        return error;
      }
    );
  }

}
