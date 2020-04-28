import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RetroalimentacionOpMul } from './video-alumno/retroalimentacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteraccionAlumnoService {
  loadSendUrl = `${ environment.apiUrl }`;
  private retroalimentacionMul: RetroalimentacionOpMul;

  constructor(private http: HttpClient) {
  }

  getRetroOpMultiple(pregunta: number) {
    return this.http.get(this.loadSendUrl + '/activities/respuestaOpcionMultiple?esCorrecta=true&preguntaSeleccionMultiple=' + pregunta);
  }

  getMarcasXacontenido(idcontenido: number) {
    return this.http.get(this.loadSendUrl + '/activities/marcas?contenido=' + idcontenido + '&size=1000');
  }

  getPreguntaXMarca(idmarca: number) {
    return this.http.get(this.loadSendUrl + '/activities/preguntaOpcionMultiple/' + idmarca);
  }
}
