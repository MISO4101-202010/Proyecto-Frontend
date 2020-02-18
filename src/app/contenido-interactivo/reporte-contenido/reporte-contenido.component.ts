import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reporte-contenido',
  templateUrl: './reporte-contenido.component.html',
  styleUrls: ['./reporte-contenido.component.css']
})
export class ReporteContenidoComponent implements OnInit {

  displayedColumns: string[] = ['pregunta', 'posiblesRespuestas', 'respuestasOpcion', 'porcentajeRespuesta'];
  dataSource;

  constructor(private contenidoService: ContenidoService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.contenidoService.getReporteContenido(+params.id).subscribe(data => {
          this.dataSource = [];
          this.processData(data.marcas).forEach(element => {
              this.dataSource.push(element);
          });
          console.log('dataSource', this.dataSource);
        });
      }
    });
  }

  processData(data) {
    console.log(data);
    const preguntas = data.map(marca => marca.preguntas);

    const preguntasFlatten = this.flatten(preguntas);

    console.log(preguntasFlatten);

    // Deja un array flat con todas las actividades
    // const flatActivites = this.calculatePercentage(this.flatten(activities));
    // calcula y retorna porcentaje de respuesta por cada pregunta
    // return this.calculatePercentage(flatActivites);
    console.log(this.calculatePercentage(preguntasFlatten));
    return this.calculatePercentage(preguntasFlatten);
  }

  calculatePercentage(preguntas) {
    const actividadesPorcentaje = preguntas.map(pregunta => {
        const total = pregunta.total_respuestas;
        if (pregunta.tipo === 'multiple') {
          pregunta.opciones.map(opcion => {
            opcion.porcentajeRespuesta = total !== 0 ? (opcion.votos * 100) / total : 0;
            return opcion;
          });
        } else if (pregunta.tipo === 'verdadero/falso') {
          pregunta.respuestaCorrecta = pregunta.esCorrecta;
          pregunta.porcentajeVerdadero = total !== 0 ? (pregunta.total_verdadero * 100) / total : 0;
          pregunta.porcentajeFalso = total !== 0 ? (pregunta.total_falso * 100) / total : 0;
        }
        return pregunta;
      });
    return actividadesPorcentaje;
  }

  flatten(arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  }

}
