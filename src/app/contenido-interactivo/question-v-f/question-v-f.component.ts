import {Component, Inject, OnInit} from '@angular/core';
import {PreguntaFalsoVerdadero} from '../../models/mark/questionTrueFalse';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ActivitiesService} from '../../services/activities-service/activities.service';
import Swal from 'sweetalert2';

export interface DialogData {
  marca: any;
}

@Component({
  selector: 'app-question-v-f',
  templateUrl: './question-v-f.component.html',
  styleUrls: ['./question-v-f.component.css']
})
export class QuestionVFComponent implements OnInit {

  hayPregunta = false;
  yaRespondio = false;
  respuesta = '';
  respuestaControl = new FormControl();
  respuestaCorrecta = new FormControl();
  infoPregunta: PreguntaFalsoVerdadero;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public dialogRef: MatDialogRef<QuestionVFComponent>,
              private activityService: ActivitiesService) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getInfoQuestion();
  }

  getInfoQuestion() {
    console.log('info data', this.data);
    this.activityService.getActivityFVById(this.data.marca.marca_id).subscribe(
      data => {
        this.infoPregunta = data.body;
        const correcta = (this.infoPregunta.esVerdadero) ? 'Verdadero' : 'Falso';
        this.respuesta = correcta;
        this.hayPregunta = true;
      }, error => {
        console.log('Error getting question information -> ', error);
      }
    );
  }

  responderPregunta() {
    if (this.respuestaControl.value !== null) {
      this.respuestaControl.disable();
      const idEstudiante = JSON.parse(sessionStorage.userConectaTe).dataProfesor.id;
      // Acá debe ir la petición al servicio REST para guardar la respuesta del alumno y si sale bien se cambian las dos variables
      this.yaRespondio = true;
      this.infoPregunta.puedeSaltar = true;
    } else {
      Swal.fire('Responde!!', 'Parece que aún no has seleccionado una respuesta, inténtalo de nuevo', 'error');
    }
  }

  saltar() {
    this.dialogRef.close();
  }

}
