import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivitiesService } from '../../../services/activities-service/activities.service';
import { ValidationService } from '../../../services/validation.service';

export interface DialogData {
  marca: any;
  tiene_retroalimentacion?: boolean;
}

@Component({
  selector: 'app-crear-pregunta-verdadero-falso',
  templateUrl: './crear-pregunta-verdadero-falso.component.html',
  styleUrls: ['./crear-pregunta-verdadero-falso.component.css']
})
export class CrearPreguntaVerdaderoFalsoComponent {

  questionForm: FormGroup;
  respuestaControl = new FormControl('verdadero');
  title: string;
  nombreMaxLength = 30;
  preguntaMaxLength = 200;
  retroalimentacionMaxLength = 200;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CrearPreguntaVerdaderoFalsoComponent>,
              private contenidoService: ContenidoService,
              private activityService: ActivitiesService,
              private validationService: ValidationService) {
    this.initializeForm();
    this.getQuestion();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(this.nombreMaxLength)]],
      pregunta: ['', [Validators.required, Validators.maxLength(this.preguntaMaxLength)]],
      tieneRetroalimentacion: [false, [Validators.required]],
      retroalimentacion: ['', [Validators.maxLength(this.retroalimentacionMaxLength)]],
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
          this.questionForm.get('tieneRetroalimentacion').setValue(preguntaVF.body.tieneRetroalimentacion);
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

  delete() {
    this.dialogRef.close(this.data.marca.id);
  }

  cancel() {
    this.dialogRef.close();
  }

  checkValidators() {
    if (this.questionForm.get('tieneRetroalimentacion').value && this.questionForm.get('retroalimentacion').value.trim() === '') {
      Swal.fire('Oops...', 'La retroalimentación no puede ser vacía si se escogió retroalimentación', 'warning');
      return true;
    }
    return false;
  }

  crearMarca() {
    if (this.questionForm.valid && !this.checkValidators() && !this.data.marca.marca_id) {
      this.data.marca.punto = Math.round(this.data.marca.punto);
      const infoMarca = this.data.marca;
      infoMarca.contenido = infoMarca.contenido_id;
      this.questionForm.value.esVerdadero = this.respuestaControl.value === 'verdadero';
      this.questionForm.value.tieneRetroalimentacion = this.questionForm.get('tieneRetroalimentacion').value;
      this.questionForm.value.tipoActividad = 2;
      if (!this.questionForm.get('tieneRetroalimentacion').value) {
        this.questionForm.value.retroalimentacion = '';
      }

      this.contenidoService.agregarMarca(infoMarca).subscribe(result1 => {
        this.questionForm.value.marca = result1.id;
        this.contenidoService.agregarMarcaVerdaderoFalso(this.questionForm.value).subscribe(result2 => {
          Swal.fire('Pregunta agregada', 'Pregunta agregada correctamente', 'success');
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
      if (!this.questionForm.get('tieneRetroalimentacion').value) {
        this.questionForm.get('retroalimentacion').setValue('');
      }

      const marcaAEditar = {
        pregunta: this.questionForm.get('pregunta').value,
        nombre: this.questionForm.get('nombre').value,
        esVerdadero: this.respuestaControl.value === 'verdadero',
        tieneRetroalimentacion: this.questionForm.get('tieneRetroalimentacion').value,
        retroalimentacion: this.questionForm.get('retroalimentacion').value
      };
      this.contenidoService.modificarPreguntaVoF(this.data.marca.id, marcaAEditar).subscribe(response => {
        Swal.fire('Pregunta modificada', 'Pregunta modificada correctamente', 'success');
        this.dialogRef.close();
      }, error => {
        console.error(error);
        Swal.fire('Oops...', 'Ocurrió un error modificando la marca, por favor inténtalo de nuevo', 'error');
      });
    }
  }
}
