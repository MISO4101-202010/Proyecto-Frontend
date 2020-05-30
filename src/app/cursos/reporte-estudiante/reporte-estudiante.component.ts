import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ContenidoService } from 'src/app/services/contenido.service';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/usuario/auth.service';

@Component({
  selector: 'app-reporte-estudiante',
  templateUrl: './reporte-estudiante.component.html',
  styleUrls: ['./reporte-estudiante.component.css']
})
export class ReporteEstudianteComponent implements OnInit {
  nombreCurso: string;
  idCurso: number;
  idEstudiante: number = (this.authService.getDatos().dataAlumno as any).id;

  displayedColumns: string[] = ['contenido', 'calificacion','detalle'];
  dataSource = new MatTableDataSource(); 

  @ViewChild('scheduledOrdersPaginator', {static:false}) paginator: MatPaginator;

  constructor(private contenidoService: ContenidoService,
              private cursoService: CursoService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {}
  
  capitalize = (s) => {
                          if (typeof s !== 'string') return ''
                          return s.charAt(0).toUpperCase() + s.slice(1)
                      };
  ngOnInit() 
  {
    this.idCurso = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.cursoService.getCursos().subscribe((cursos: any[]) => {
      let curso = cursos.find((c)=> c.id == this.idCurso);
      this.nombreCurso = curso.nombre;
    });
    this.cursoService.getQualificationByCourse(this.idEstudiante,this.idCurso)
    .subscribe((contenidos: any[]) => {
      let data = contenidos.map(el=> {
                                      return {
                                                contenido: el.contenidoNombre,
                                                calificacion: (el.preguntasCalificadas == 0 && 
                                                               el.calificacionTotal == 0 && 
                                                               el.respuestas.length >0 ) ? 'Pendiente de Calificar': 
                                                               (el.preguntasCalificadas == 0)?'Pendiente de Presentar':
                                                                                            'Calificación: ' + parseFloat(el.calificacionTotal).toFixed(2) + '/' + 5,
                                                detalle: 'Ver calificación detallada',
                                                id: el.contenidoInt

                                            }
                                });
      console.log('data', data);
      this.dataSource.data=[];
      data.forEach((el)=>this.dataSource.data.push(el));
      this.dataSource.paginator = this.paginator;
    }); 
  }

}
