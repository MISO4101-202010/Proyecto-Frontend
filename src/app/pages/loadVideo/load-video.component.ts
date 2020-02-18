import { Component, OnInit } from '@angular/core';
import { LoadVideoService } from '../../services/contenidoInter/load-video.service';
import { LoadVideo } from '../../models/videoLoad.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-load-video',
  templateUrl: './load-video.component.html',
  styles: [`
    .contenedor {
      margin: 40px 0px 0px 50px;
    }
    h2 {
    //  color: #00008B;
      margin-bottom: 5%;
      font-weight: bold;
    }
    .anchoNombre {
      width: 30%;
    }
    .anchoUrl {
      width: 65%;
    }
`]
})
export class LoadVideoComponent implements OnInit {

  loadVideo: LoadVideo = {
    url: '',
    nombre: '',
  };
  options: FormGroup;

  constructor(fb: FormBuilder, private _loadVideoService: LoadVideoService,
              public router: Router, public dialogRef: MatDialogRef<LoadVideoComponent>) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }
  
  guardarVideo(n: any, v: any) {
    this.loadVideo.url = v.value;
    this.loadVideo.nombre = n.value;
    // this.loadVideo.url = "https://www.youtube.com/watch?v=3JuYkJyJh7c";
    // this.loadVideo.nombre = "Entender a Supergirl";
    // this.loadVideo.cursos_seleccionados = [{ "id": 1 }];
    this._loadVideoService.loadUrl(this.loadVideo)
      .subscribe(
        result => {
          console.log(result);
          Swal.fire('Agregar contenido', 'Contenido agregado correctamente', 'success');
          this.cancel();

        },
        error => {
          console.log(error);
          Swal.fire('Oops...', 'Revisa los datos ingresados', 'error');
        },
        () => {
          // Swal.fire('Cargado!', 'Tu video ha sido cargado con Exito a contenido interactivo.', 'success')
          this.router.navigate(['/page/crearContenidoInt']);
        }
      );
  }

  cancel() {
    this.dialogRef.close();
  }

}
