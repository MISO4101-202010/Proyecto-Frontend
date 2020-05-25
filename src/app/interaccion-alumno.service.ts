import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteraccionAlumnoService {
  loadSendUrl = `${ environment.apiUrl }`;

  constructor(private http: HttpClient) {
  }

  getRetroOpMultiple(pregunta: number) {
    return this.http.get(this.loadSendUrl + '/activities/respuestaOpcionMultiple?esCorrecta=true&preguntaSeleccionMultiple=' + pregunta);
  }

  getMarcasXacontenido(idcontenido: number) {
    return this.http.get(this.loadSendUrl + '/activities/marcas?contenido=' + idcontenido);
  }

  getPreguntaXMarca(idmarca: number) {
    return this.http.get(this.loadSendUrl + '/activities/preguntaOpcionMultiple/' + idmarca);
  }

  getCalificacionXContenidoInteractivo(idContenidoInteractivo){
    const idEstudiante = JSON.parse(sessionStorage.userConectaTe).dataProfesor.id;
    return this.http.get(this.loadSendUrl + `/activities/calificaciones_reporte?estudiante=${idEstudiante}&contenidoInt=${idContenidoInteractivo}`);
  }
}
