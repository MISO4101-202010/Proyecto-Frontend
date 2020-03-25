import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import Swal from 'sweetalert2';
import {ContenidoService} from 'src/app/services/contenido.service';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-crear-pregunta-verdadero-falso',
  templateUrl: './crear-pregunta-verdadero-falso.component.html',
  styleUrls: ['./crear-pregunta-verdadero-falso.component.css']
})
export class CrearPreguntaVerdaderoFalsoComponent implements OnInit {

  questionForm: FormGroup;
  respuestaControl = new FormControl('verdadero');
  retroalimentacionControl = new FormControl('no');
  saltarControl = new FormControl('si');

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CrearPreguntaVerdaderoFalsoComponent>,
              private contenidoService: ContenidoService) {
    this.initializeForm();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      pregunta: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      retroalimentacion: [''],
      numeroDeIntentos: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  crearMarca() {
    if (this.questionForm.valid) {
      const infoMarca = this.data.marca;
      infoMarca.contenido = infoMarca.contenido_id;
      const respuestaCorrecta = (this.respuestaControl.value === 'verdadero');
      const tieneRetro = (this.retroalimentacionControl.value === 'si');
      const saltar = (this.saltarControl.value === 'si');
      this.questionForm.value.esVerdadero = respuestaCorrecta;
      this.questionForm.value.puedeSaltar = saltar;
      this.questionForm.value.tieneRetroalimentacion = tieneRetro;
      this.questionForm.value.tipoActividad = 3;
      this.contenidoService.agregarMarca(infoMarca).subscribe(result1 => {
        this.questionForm.value.marca = result1.id;
        this.contenidoService.agregarMarcaVerdaderoFalso(this.questionForm.value).subscribe(result2 => {
          console.error(result2);
          Swal.fire('Agregar Pregunta', 'Pregunta agregada correctamente', 'success');
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
  }

}
