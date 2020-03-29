import {Component, Inject, OnInit} from '@angular/core';
import {PreguntaFalsoVerdadero} from '../../models/mark/questionTrueFalse';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ActivitiesService} from '../../services/activities-service/activities.service';
import Swal from 'sweetalert2';
import {AnswerVoF} from 'src/app/models/mark/answerVoF';

export interface DialogData {
  marca: any;
  contenidoInteractivo: any;
}

@Component({
  selector: 'app-question-v-f',
  templateUrl: './question-v-f.component.html',
  styleUrls: ['./question-v-f.component.css']
})
export class QuestionVFComponent implements OnInit {
  canJump: boolean;
  answer: AnswerVoF;
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
        this.canJump = this.data.contenidoInteractivo.puedeSaltar;
      }, error => {
        console.log('Error getting question information -> ', error);
      }
    );
  }

  responderPregunta() {
    if (this.respuestaControl.value !== null) {
      const idEstudiante = JSON.parse(sessionStorage.userConectaTe).dataProfesor.id;
      const respuestaCorrecta = (this.respuestaControl.value === 'verdadero');
      this.answer = new AnswerVoF(String(this.infoPregunta.id), respuestaCorrecta, String(idEstudiante), 0);
      console.log('Respuesta: ', this.answer);
      this.activityService.postFVAnswer(this.answer).subscribe(
        data => {
          this.respuestaControl.disable();
          this.answer = data.body;
          this.yaRespondio = true;
          this.infoPregunta.puedeSaltar = true;
        },
        error => {
            Swal.fire('Error!!', error.error[0]);
        }
      );
    } else {
      Swal.fire('Responde!!', 'Parece que aún no has seleccionado una respuesta, inténtalo de nuevo', 'error');
    }
  }

  saltar() {
    this.dialogRef.close();
  }
}
