import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  private contenidoUrl = `${environment.apiUrl}/content/interactive_content/`;
  private reportesUrl = `${environment.apiUrl}/activities/reports/`;
  private cursosUrl = `${environment.apiUrl}/content/courses/`;
  private contenidoInteractivoUrl = `${environment.apiUrl}/content/interactiveContentByCourse/`;
  private addPreguntaSelecconMultipleUrl = `${environment.apiUrl}/activities/generate-question-multiple-choice`;
  private deletePreguntaSelecconMultipleUrl = `${environment.apiUrl}/activities/delete-question-multiple-choice`;
  private addPreguntaAbiertaUrl = `${environment.apiUrl}/activities/generate-open-question`;
  private preguntaFalsoVerdaderoUrl = `${environment.apiUrl}/activities/pregunta_f_v`;
  private detalleUrl = `${environment.apiUrl}/content/interactivecontent/`;
  private crearContenidoInteractivo = `${environment.apiUrl}/content/cont_interactivo`;
  private crearMarca = `${environment.apiUrl}/activities/marca`;
  private createPauseMark = `${environment.apiUrl}/activities/create-pausa/`;

  constructor(private httpClient: HttpClient) {
  }

  getContenidos(): Observable<any> {
    return this.httpClient.get<any>(this.contenidoUrl);
  }

  actualizarMarca(marcaid: number, contenidoId: number, puntoId: number, nombre: string) {
    const body = {
      marca_id: marcaid,
      nombre: nombre,
      punto: puntoId,
      contenido: contenidoId
    };
    return this.httpClient.put(this.crearMarca, body);
  }

  postContenidoInteractivo(nombre: string, contenidoId: number, puedeSaltar: boolean, tieneRetroalimentacion: boolean, esCalificable: boolean) {
    const body = {
      nombre: nombre,
      contenido: contenidoId,
      puedeSaltar: puedeSaltar,
      tiene_retroalimentacion: tieneRetroalimentacion,
      es_calificable: esCalificable
    };
    console.log('body:', body);
    return this.httpClient.post(this.crearContenidoInteractivo, body);
  }

  postContenidos(cursoIds: Array<number>, contenidoId: number) {
    const body = {
      cursos: cursoIds,
      contenido: contenidoId
    };
    return this.httpClient.post(this.contenidoUrl, body);
  }

  getDetalleContenidoInteractivo(contentId: number): Observable<any> {
    return this.httpClient.get<any>(this.detalleUrl + contentId);
  }

  getReporteContenido(contentId: number): Observable<any> {
    return this.httpClient.get<any>(this.reportesUrl + contentId);
  }

  getCursosList(): Observable<any>  {
    return this.httpClient.get<any>(this.cursosUrl);
  }

  getCursosIdList(id: string): Observable<any>  {
    return this.httpClient.get<any>(this.contenidoInteractivoUrl + id);
  }

  agregarMarcaPreguntaSeleccionMultiple(marca: any): Observable<any> {
    return this.httpClient.put(this.addPreguntaSelecconMultipleUrl, marca);
  }

  eliminarMarcaPreguntaSeleccionMultiple(marca: any): Observable<any> {
    return this.httpClient.delete(this.deletePreguntaSelecconMultipleUrl, marca);
  }

  agregarMarcaPreguntaAbierta(marca: any): Observable<any> {
    return this.httpClient.put(this.addPreguntaAbiertaUrl, marca);
  }

  agregarMarcaVerdaderoFalso(pregunta: any): Observable<any> {
    return this.httpClient.post(this.preguntaFalsoVerdaderoUrl, pregunta);
  }

  agregarMarca(marca: any): Observable<any> {
    return this.httpClient.post(this.crearMarca, marca);
  }

  agregarMarcaPreguntaPausa(marca: any): Observable<any> {
    return this.httpClient.put(this.createPauseMark, marca);
  }

  saveInteractiveContent(contenidoId: number, name: string, canJump: boolean, hasRetro: boolean, esCalificable: boolean) {
    const body = {
      nombre: name,
      puedeSaltar: canJump,
      tiene_retroalimentacion: hasRetro,
      es_calificable: esCalificable
    };
    return this.httpClient.patch(this.detalleUrl + contenidoId, body);
  }

  modificarPreguntaVoF(marcaId: number, marca: any): Observable<any> {
    return this.httpClient.patch(this.preguntaFalsoVerdaderoUrl + '/update/' + marcaId + '/', marca);
  }
}
