import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-seleccion-multiple',
  templateUrl: './crear-seleccion-multiple.component.html',
  styleUrls: ['./crear-seleccion-multiple.component.css']
})
export class CrearSeleccionMultipleComponent implements OnInit {

  questionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearSeleccionMultipleComponent>,
    private contenidoService: ContenidoService) {

    this.initializeForm();
  }

  ngOnInit() {
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      enunciado: ['', [Validators.required]],
      esMultipleResp: [false, [Validators.required]],
      nombre: ['', [Validators.required]],
      tieneRetroalimentacion: [false, [Validators.required]],
      numeroDeIntentos: [1, [Validators.required, Validators.min(1)]],
      opciones: this.formBuilder.array([])
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  agregarOpcion() {
    const opciones = this.questionForm.controls.opciones as FormArray;
    opciones.push(this.formBuilder.group({
      opcion: ['', [Validators.required]],
      esCorrecta: false,
    }));
  }

  validarUnaCorrecta() {
    const result = this.questionForm.value.opciones.find(opcion => opcion.esCorrecta);
    console.log(result);
    return result;
  }

  validarUnaOpcion() {
    return this.questionForm.value.opciones.length > 1;
  }

  agregarMarca() {
    console.log('data', this.data);
    console.log('form', this.questionForm.value);
    if (this.questionForm.valid) {
      if (!this.validarUnaOpcion()) {
        console.error('Al menos una opcion');
        Swal.fire('Oops...', 'Ingresa más de una opción', 'error');
      } else if (!this.validarUnaCorrecta()) {
        Swal.fire('Oops...', 'Ingresa al menos una opción correcta', 'error');
      } else {
        this.questionForm.value.marca = this.data.marca;
        this.contenidoService.agregarMarcaPreguntaSeleccionMultiple(this.questionForm.value).subscribe(result => {
          Swal.fire('Agregar Marca', 'Marca agregada correctamente', 'success');
          this.dialogRef.close();
        }, error => {
          console.error(error);
          Swal.fire('Oops...', 'Ocurrió un error agregando la marca, por favor inténtalo de nuevo', 'error');
        });
      }
    }
  }

  quitarOpcion(i) {
    const opciones = this.questionForm.get('opciones') as FormArray;
    opciones.removeAt(opciones.length - 1);
  }

}
