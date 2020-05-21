import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { environment } from 'src/environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { AnswerVoF } from 'src/app/models/mark/answerVoF';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  private activitiesUrl = `${environment.apiUrl}/activities/`;

  constructor(private httpService: HttpService) {
  }

  getActivityById(id): Observable<any> {
    const preguntaOpcionMultiple = this.httpService.getRequestWithoutParams(this.activitiesUrl + 'preguntaOpcionMultiple/' + id + '/').map(
      response => {
        response.body.results.forEach(o => {
          o.type = 'preguntaOpcionMultiple';
        });
        return response;
      }, error => {
        return error;
      }
    );

    const preguntaAbierta = this.httpService.getRequestWithoutParams(this.activitiesUrl + 'preguntaAbierta/' + id + '/').map(
      response => {
        response.body.results.forEach(o => {
          o.type = 'preguntaAbierta';
        });
        return response;
      }, error => {
        return error;
      }
    );

    const pausa = this.httpService.getRequestWithoutParams(this.activitiesUrl + 'pausas/' + id + '/').map(
      response => {
        response.body.results.forEach(o => {
          o.type = 'pausa';
        });
        return response;
      }, error => {
        return error;
      }
    );

    return forkJoin([preguntaOpcionMultiple, preguntaAbierta, pausa]);
  }

  getActivityFVById(id): Observable<any> {
    const url = this.activitiesUrl + 'pregunta_f_v/' + id;
    return this.httpService.getRequestWithoutParams(url).map(
      response => {
        response.body.type = 'preguntaVoF';
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

  postSaveAnswerQuestion(answer: any): Observable<any> {
    let url = '';
    if (answer.typeQuestion === 'preguntaOpcionMultiple') {
      url = this.activitiesUrl + 'respuestaOpcionMultiple/';
    } else if (answer.typeQuestion === 'preguntaAbierta') {
      url = this.activitiesUrl + 'respuestaAbierta/';
    }
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
