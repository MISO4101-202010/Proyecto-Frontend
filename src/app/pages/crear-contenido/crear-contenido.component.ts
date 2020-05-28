import { Component, OnInit, Inject } from '@angular/core';
import { LoadVideoService } from '../../services/contenidoInter/load-video.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContenidoService } from '../../services/contenido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadVideoComponent } from '../loadVideo/load-video.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-contenido',
  templateUrl: './crear-contenido.component.html',
  styleUrls: ['./crear-contenido.component.css']
})
export class CrearContenidoComponent implements OnInit {

  constructor(private _loadVideoService: LoadVideoService, public dialog: MatDialog) { }

  listContenido = [];

  ngOnInit() {
    this.loadContenido();
  }

  loadContenido() {
    this._loadVideoService.getContenido().subscribe(
      (result) => {
        console.log('ED: ', result);
        this.listContenido = result;
      },
      (error) => {
        console.log('Edu: ', error);
      },
      () => {}
    );
  }

  openModal(video): void {
    console.log('llamado modal', video);
    const dialogRef = this.dialog.open(ModalAsociarContenidoInt, {
      width: '40%',
      data: { video: video.nombre, id: video.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAddVideoModal(): void {
    const dialogRef = this.dialog.open(LoadVideoComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadContenido();
    });
  }
}

//modal
@Component({
  selector: 'modal-AsoContInt',
  templateUrl: 'modal-asociar-contenido.html',
})
export class ModalAsociarContenidoInt {
  constructor(
    public dialogRef: MatDialogRef<ModalAsociarContenidoInt>,
    @Inject(MAT_DIALOG_DATA) public data,
    public _contenidoService: ContenidoService,
    public router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  crearContenido(nombre, id, puedeSaltar, tieneRetroalimentacion, esCalificable) {
    console.error('84', nombre.value, id);
    if (!nombre.value || nombre.value === '') {
      Swal.fire('Oops...', 'Por favor ingresa un nombre', 'error');
    } else {
      this._contenidoService.postContenidoInteractivo(nombre.value, id, puedeSaltar, tieneRetroalimentacion, esCalificable).subscribe(result => {
        // tslint:disable-next-line: no-string-literal
        this.onNoClick();
        this.router.navigate(['contenido-interactivo/configurar/', result['id']]);
      });

    }
  }
}
