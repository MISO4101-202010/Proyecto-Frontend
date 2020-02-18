import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { MatDialog } from '@angular/material/dialog';
import { AddContenidoACursoComponent } from '../add-contenido-a-curso/add-contenido-a-curso.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-contenido',
  templateUrl: './lista-contenido.component.html',
  styleUrls: ['./lista-contenido.component.css']
})
export class ListaContenidoComponent implements OnInit {

  contenidos: any;
  showAddMarker = false;

  constructor(private contenidoService: ContenidoService, public dialog: MatDialog, public router: Router
    ) { }

  ngOnInit() {
    this.getContenidos();
  }
  getContenidos() {
    this.contenidoService.getContenidos().subscribe(data => {
      console.log('data', data);
      this.contenidos = data;
    });
  }

  addContenidoACurso(contenidoId: number, nombreContenido: string) {

    const dialogRef = this.dialog.open(AddContenidoACursoComponent, {
      width: '60%',
      data: {
        contenidoId,
        nombreContenido
      }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getContenidos();
     });

  }

  addMarker() {
    this.showAddMarker = true;
  }

  showVideo(idVideo) {
    console.log('ir a ver video');
    this.router.navigate(['/video-alumno', idVideo]);
  }
}
