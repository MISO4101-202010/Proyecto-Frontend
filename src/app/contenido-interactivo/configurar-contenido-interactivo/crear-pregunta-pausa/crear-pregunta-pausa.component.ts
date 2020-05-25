import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-pregunta-pausa',
  templateUrl: './crear-pregunta-pausa.component.html',
  styleUrls: ['./crear-pregunta-pausa.component.css']
})
export class CrearPreguntaPausaComponent implements OnInit {
  questionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearPreguntaPausaComponent>,
    private contenidoService: ContenidoService
  ) {
    this.initializeForm(data);
  }

  ngOnInit() {
  }

  initializeForm(data) {
    this.questionForm = this.formBuilder.group({
      marca_id: [data.marca.pregunta ? data.marca.pregunta.marca : ''],
      pausa_id: [data.marca.pregunta ? data.marca.pregunta.id : ''],
      nombre: [data.marca.pregunta ? data.marca.nombre : '', [Validators.required]],
      tiempo: [data.marca.pregunta ? data.marca.pregunta.tiempo : '',
      [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
      enunciado: [data.marca.pregunta ? data.marca.pregunta.enunciado : '', [Validators.required]],
      numeroDeIntentos: 1
    });
    if (!data.marca.pregunta) {
      this.questionForm.get('nombre').setValidators(null);
      this.questionForm.removeControl('marca_id');
      this.questionForm.removeControl('pausa_id');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  agregarMarca() {
    if (this.questionForm.valid) {
      let texto;
      let texto2;
      let texto3;
      if (this.data.marca.pregunta) {
        delete this.data.marca.pregunta;
        texto = 'Actualizar Marca';
        texto2 = 'Marca actualizada correctamente';
        texto3 = 'actualizando';
      } else {
        texto = 'Agregar Marca';
        texto2 = 'Marca agregada correctamente';
        texto3 = 'agregando';
      }
      this.questionForm.value.marca = this.data.marca;
      this.contenidoService
        .agregarMarcaPreguntaPausa(this.questionForm.value)
        .subscribe(
          result => {
            Swal.fire(
              texto,
              texto2,
              'success'
            );
            this.dialogRef.close();
          },
          error => {
            console.error(error);
            Swal.fire(
              'Oops...',
              'Ocurrió un error ' + texto3 + ' la marca, por favor inténtalo de nuevo',
              'error'
            );
          }
        );
    }
  }
}
