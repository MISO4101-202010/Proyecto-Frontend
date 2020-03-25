import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
}


@Component({
  selector: 'app-crear-pregunta-abierta',
  templateUrl: './crear-pregunta-abierta.component.html',
  styleUrls: ['./crear-pregunta-abierta.component.css']
})
export class CrearPreguntaAbiertaComponent implements OnInit {

  questionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearPreguntaAbiertaComponent>,
    private contenidoService: ContenidoService) {

    this.initializeForm();
  }

  ngOnInit() {
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      enunciado: ['', [Validators.required]],
      nombre: ['', [Validators.required]]
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  agregarMarca() {
    console.log('data', this.data);
    console.log('form', this.questionForm.value);
    if (this.questionForm.valid) {
      this.questionForm.value.marca = this.data.marca;
      this.contenidoService.agregarMarcaPreguntaAbierta(this.questionForm.value).subscribe(result => {
        Swal.fire('Agregar Marca', 'Marca agregada correctamente', 'success');
        this.dialogRef.close();
      }, error => {
        console.error(error);
        Swal.fire('Oops...', 'Ocurrió un error agregando la marca, por favor inténtalo de nuevo', 'error');
      });
    }
  }
}
