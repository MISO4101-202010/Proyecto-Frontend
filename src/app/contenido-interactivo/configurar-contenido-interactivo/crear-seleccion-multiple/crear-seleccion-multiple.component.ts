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
  formArray = new FormArray([]);
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
    console.log('multiple', this.data );   
    if(this.data.marca.pregunta)
      this.data.marca.pregunta[0].opciones.forEach(e => {
      let formGroup = new FormBuilder();
      this.formArray.push(   formGroup.group({
                                                opcion_id: [e.id],
                                                opcion: [e.opcion],
                                                esCorrecta: [e.esCorrecta]
                                              }))});

    this.questionForm = this.formBuilder.group({
      marca_id: [this.data.marca.pregunta ? this.data.marca.pregunta[0].marca : ''],
      seleccion_multiple_id: [this.data.marca.pregunta ? this.data.marca.pregunta[0].id : ''],
      enunciado: [this.data.marca.pregunta ? this.data.marca.pregunta[0].enunciado : '', [Validators.required]],
      esMultipleResp: [this.data.marca.pregunta ? this.data.marca.pregunta[0].esMultipleResp : false, [Validators.required]],
      nombre: [this.data.marca.pregunta ? this.data.marca.pregunta[0].nombre : '', [Validators.required]],
      tieneRetroalimentacion: [this.data.marca.pregunta ? this.data.marca.pregunta[0].tieneRetroalimentacion : false, [Validators.required]],
      numeroDeIntentos: [this.data.marca.pregunta ? this.data.marca.pregunta[0].numeroDeIntentos : 1, [Validators.required, Validators.min(1)]],
      opciones:  (this.data.marca.pregunta) ? this.formArray : this.formBuilder.array([])
    });
    if (!this.data.marca.pregunta) {
      this.questionForm.removeControl('marca_id');
      this.questionForm.removeControl('seleccion_multiple_id');
    }
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
        let texto;
        let texto2;
        let texto3;
        if (this.data.marca.pregunta) {
          delete this.data.marca.pregunta;
          texto = 'Actualizar Marca';
          texto2 = 'Marca actualizada correctamente';
          texto3 = 'actualizando';
        } else{
          texto = 'Agregar Marca';
          texto2 = 'Marca agregada correctamente';
          texto3 = 'agregando';
        }
        this.questionForm.value.marca = this.data.marca;
        this.contenidoService.agregarMarcaPreguntaSeleccionMultiple(this.questionForm.value).subscribe(result => {
          Swal.fire(texto, texto2, 'success');
          this.dialogRef.close();
        }, error => {
          console.error(error);
          Swal.fire('Oops...', 'Ocurrió un error '+ texto3 +' la marca, por favor inténtalo de nuevo', 'error');
        });
      }
    }
  }

  quitarOpcion(i) {
    const opciones = this.questionForm.get('opciones') as FormArray;
    opciones.removeAt(i);
  }

}
