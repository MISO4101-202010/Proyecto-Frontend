import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { RetroalimentacionOpMul } from './video-alumno/retroalimentacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteraccionAlumnoService {
  loadSendUrl =  `${environment.apiUrl}`;
  private retroalimentacionMul: RetroalimentacionOpMul;

  constructor(private http: HttpClient) { }


   /*   getActividad(marca: number) {
    return this.http.get(this.api_base_url + 'activities/actividad?marca=1' + marca);
  }

    getPregunta(actividad: number) {
    return this.http.get(this.api_base_url + '/activities/resp_op_multiple?esCorrecta=true&preguntaSeleccionMultiple=' + pregunta);
  }*/

  getRetroOpMultiple(pregunta: number) {
    return this.http.get(this.loadSendUrl + '/activities/respuestaOpcionMultiple?esCorrecta=true&preguntaSeleccionMultiple=' + pregunta);
  }
    getMarcasXacontenido(idcontenido: number) {
    return this.http.get(this.loadSendUrl + '/activities/marca?contenido=' + idcontenido);
  }

  getPreguntaXMarca(idmarca: number) {
    return this.http.get(this.loadSendUrl + '/activities/preguntaOpcionMultiple/' + idmarca);
  }
}
