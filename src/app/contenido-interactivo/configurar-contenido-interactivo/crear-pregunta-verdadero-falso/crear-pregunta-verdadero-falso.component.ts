import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivitiesService } from "../../../services/activities-service/activities.service";

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-pregunta-verdadero-falso',
  templateUrl: './crear-pregunta-verdadero-falso.component.html',
  styleUrls: ['./crear-pregunta-verdadero-falso.component.css']
})
export class CrearPreguntaVerdaderoFalsoComponent {

  questionForm: FormGroup;
  respuestaControl = new FormControl('verdadero');
  retroalimentacionControl = new FormControl('no');
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CrearPreguntaVerdaderoFalsoComponent>,
              private contenidoService: ContenidoService,
              private activityService: ActivitiesService) {
    this.initializeForm();
    this.getQuestion();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      pregunta: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      retroalimentacion: [''],
      numeroDeIntentos: ['', [Validators.required]]
    });
  }

  getQuestion() {
    // Si hay un valor en "marca_id" significa que la pregunta se debe editar
    if (this.data.marca.marca_id) {
      this.title = 'Editar';
      this.activityService.getActivityFVById(this.data.marca.marca_id).subscribe(
        preguntaVF => {
          console.log(preguntaVF);
          this.questionForm.get('pregunta').setValue(preguntaVF.body.pregunta);
          this.questionForm.get('nombre').setValue(preguntaVF.body.nombre);
          this.respuestaControl.setValue(preguntaVF.body.esVerdadero ? 'verdadero' : 'falso');
          this.retroalimentacionControl.setValue(preguntaVF.body.tieneRetroalimentacion ? 'si' : 'no');
          this.questionForm.get('numeroDeIntentos').setValue(preguntaVF.body.numeroDeIntentos);
          this.questionForm.get('retroalimentacion').setValue(preguntaVF.body.retroalimentacion);
        }, error => {
          console.error('Ocurrió un error al obtener la pregunta', error);
          Swal.fire('Oops...', 'Ocurrió un error al obtener la pregunta, por favor inténtalo de nuevo', 'error');
          this.cancel();
        }
      );
    } else {
      this.title = 'Crear';
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  checkValidators() {
    if (this.questionForm.get('numeroDeIntentos').value <= 0 || this.questionForm.get('numeroDeIntentos').value >= 20) {
      Swal.fire('Oops...', 'La pregunta debe tener por lo menos un intento', 'error');
      return true;
    }
    if (this.questionForm.get('nombre').value === '') {
      Swal.fire('Oops...', 'El nombre no puede ser vacío', 'error');
      return true;
    }
    if (this.questionForm.get('pregunta').value === '') {
      Swal.fire('Oops...', 'La pregunta no puede ser vacía', 'error');
      return true;
    }
    if(this.retroalimentacionControl.value === 'si' && this.questionForm.get('retroalimentacion').value === ''){
      Swal.fire('Oops...', 'La retroalimentación no puede ser vacía si se escogió retroalimentación', 'error');
      return true;
    }
    return false;
  }

  crearMarca() {
    if (this.questionForm.valid && !this.checkValidators() && !this.data.marca.marca_id) {
      console.log('llega');
      this.data.marca.punto = Math.round(this.data.marca.punto);
      const infoMarca = this.data.marca;
      infoMarca.contenido = infoMarca.contenido_id;
      const respuestaCorrecta = (this.respuestaControl.value === 'verdadero');
      const tieneRetro = (this.retroalimentacionControl.value === 'si');
      this.questionForm.value.esVerdadero = respuestaCorrecta;
      this.questionForm.value.tieneRetroalimentacion = tieneRetro;
      this.questionForm.value.tipoActividad = 2;
      this.contenidoService.agregarMarca(infoMarca).subscribe(result1 => {
        this.questionForm.value.marca = result1.id;
        this.contenidoService.agregarMarcaVerdaderoFalso(this.questionForm.value).subscribe(result2 => {
          console.error(result2);
          Swal.fire('Pregunta Agregada', 'Pregunta agregada correctamente', 'success');
          this.dialogRef.close();
        }, error => {
          console.error(error);
          Swal.fire('Oops...', 'Ocurrió un error agregando la marca, por favor inténtalo de nuevo', 'error');
        });
      }, error => {
        console.error(error);
        Swal.fire('Oops...', 'Ocurrió un error agregando la marca, por favor inténtalo de nuevo', 'error');
      });
    }
    if (this.questionForm.valid && !this.checkValidators() && this.data.marca.marca_id) {
      console.log('Editardddasdsadsad');
      let booleanEsRespuestaVerdadero = false;
      let booleanTieneRetroalimentacion = false;
      if (this.respuestaControl.value === 'verdadero') {
        booleanEsRespuestaVerdadero = true;
      }
      if (this.retroalimentacionControl.value === 'si') {
        booleanTieneRetroalimentacion = true;
      }
      const marcaAEditar = {
        pregunta: this.questionForm.get('pregunta').value,
        nombre: this.questionForm.get('nombre').value,
        numeroDeIntentos: this.questionForm.get('numeroDeIntentos').value,
        esVerdadero: booleanEsRespuestaVerdadero,
        tieneRetroalimentacion: booleanTieneRetroalimentacion,
        retroalimentacion: this.questionForm.get('retroalimentacion').value
      };
      this.contenidoService.modificarPreguntaFV(this.data.marca.marca_id, marcaAEditar).subscribe(response => {
        Swal.fire('Pregunta Modificada', 'Pregunta modificada correctamente', 'success');
        this.dialogRef.close();
      }, error => {
        console.error(error);
        Swal.fire('Oops...', 'Ocurrió un error modificando la marca, por favor inténtalo de nuevo', 'error');
      });
    }
  }

}
