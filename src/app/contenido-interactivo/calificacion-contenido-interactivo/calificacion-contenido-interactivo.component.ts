import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivatedRoute } from '@angular/router';
import { InteraccionAlumnoService } from '../../interaccion-alumno.service';

@Component({
  selector: 'app-revision-content',
  templateUrl: './calificacion-contenido-interactivo.html',
  styleUrls: ['./calificacion-contenido-interactivo.css'],
})
export class CalificacionContenidoInteractivoComponent implements OnInit {
  respuestas: any;
  displayedColumns = ['nombrePregunta', 'respuestasPregunta', 'calificacion'];

  constructor(
    private contenidoService: ContenidoService,
    private activeRoute: ActivatedRoute,
    private activityService: InteraccionAlumnoService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const { idContenidoInteractivo } = this.activeRoute.snapshot.params;
    this.activityService
      .getCalificacionXContenidoInteractivo(idContenidoInteractivo)
      .subscribe((respuestas) => (this.respuestas = respuestas));
  }
}
