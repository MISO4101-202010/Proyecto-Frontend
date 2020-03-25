import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

  private contenidoUrl = `${environment.apiUrl}/content/interactive_content/`;
  private reportesUrl = `${environment.apiUrl}/activities/reports/`;
  private addPreguntaSelecconMultipleUrl = `${environment.apiUrl}/activities/generate-question-multiple-choice`;
  private addPreguntaAbiertaUrl = `${environment.apiUrl}/activities/generate-open-question`;
  private addPreguntaFalsoVerdaderoUrl = `${environment.apiUrl}/activities/pregunta_f_v`;
  private detalleUrl = `${environment.apiUrl}/content/interactivecontent/`;
  private crearContenidoInteractivo = `${environment.apiUrl}/content/cont_interactivo`;
  private crearMarca = `${environment.apiUrl}/activities/marca`;

  constructor(private httpClient: HttpClient) {
  }

  getContenidos(): Observable<any> {
    return this.httpClient.get<any>(this.contenidoUrl);
  }

  postContenidoInteractivo(nombre: string, contenidoId: number) {
    const body = {
      nombre: nombre,
      contenido: contenidoId
    };
    console.log('body:', body);
    return this.httpClient.post(this.crearContenidoInteractivo, body);
  }

  postContenidos(cursoIds: Array<number>, contenidoId: number) {
    const body = {
      cursos: cursoIds,
      contenido: contenidoId
    };
    console.log('bodyy', body);
    return this.httpClient.post(this.contenidoUrl, body);
  }

  getDetalleContenidoInteractivo(contentId: number): Observable<any> {
    return this.httpClient.get<any>(this.detalleUrl + contentId);
  }

  getReporteContenido(contentId: number): Observable<any> {
    return this.httpClient.get<any>(this.reportesUrl + contentId);
  }

  agregarMarcaPreguntaSeleccionMultiple(marca: any): Observable<any> {
    return this.httpClient.post(this.addPreguntaSelecconMultipleUrl, marca);
  }

  agregarMarcaPreguntaAbierta(marca: any): Observable<any> {
    return this.httpClient.post(this.addPreguntaAbiertaUrl, marca);
  }

  agregarMarcaVerdaderoFalso(pregunta: any): Observable<any> {
    return this.httpClient.post(this.addPreguntaFalsoVerdaderoUrl, pregunta);
  }

  agregarMarca(marca: any): Observable<any> {
    return this.httpClient.post(this.crearMarca, marca);
  }
}
