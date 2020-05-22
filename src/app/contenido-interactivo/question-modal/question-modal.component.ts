import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivitiesService } from "src/app/services/activities-service/activities.service";
import { PreguntaOpcionMultiple } from "src/app/models/mark/questionMultiple.model";
import { OpcionesPreguntaMultiple } from "src/app/models/mark/optionsQuestionMultiple.model";
import { AnswerQuestion } from "src/app/models/mark/answerQuestion.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-question-modal",
  templateUrl: "./question-modal.component.html",
  styleUrls: ["./question-modal.component.css"]
})
export class QuestionModalComponent implements OnInit {
  canJump: boolean;
  arrayQuestionsForMark: Array<any> = new Array();
  questionInformation: any;
  hasQuestionsToShow = false;
  hasManyOptions = false;
  optionsArray: Array<{
    idOption: number;
    idQuestion: string;
    answerOption: boolean;
    titleOption: string;
  }> = new Array();
  hasFeedBack = false;
  arrayCorrectAnswers: Array<{ titleAnswer: string }> = new Array();
  indexToShow = 0;
  studentId = 3;
  idGroup = 1;
  numberTry: number;
  idContent = "";
  typeQuestion = '';
  idQuestion: string;
  time: number;

  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { idActivity; idMarca; contenidoInteractivo },
    private activityService: ActivitiesService,
    private activatedRoute: ActivatedRoute
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getQuestion();
    this.activatedRoute.params.subscribe(params => {
      this.idContent = params["id"] ? params["id"] : "";
      this.canJump = this.data.contenidoInteractivo.puedeSaltar;
    });
  }

  saveAnswer() {
    this.callServiceSaveAnswer();
    if (this.typeQuestion === 'preguntaOpcionMultiple') {
      if (this.optionsArray.some(this.hasAnswer)) {
        this.hasFeedBack = this.arrayQuestionsForMark[this.indexToShow].tieneRetroalimentacion || this.data.contenidoInteractivo.tiene_retroalimentacion;
      }
    } else if (this.typeQuestion === 'preguntaAbierta') {
      this.hasFeedBack = this.questionInformation.tieneRetroalimentacion;
    }

    if (!this.hasFeedBack) {
      this.continue();
    }
  }

  hasAnswer(element, index, array) {
    return element.answerOption;
  }

  continue() {
    this.hasFeedBack = false;
    if (this.typeQuestion === 'preguntaOpcionMultiple') {
      this.indexToShow++;
      if (this.indexToShow <= this.arrayQuestionsForMark.length - 1) {
        this.getQuestionToShow();
      } else {
        this.dialogRef.close();
      }
    } else if (this.typeQuestion === 'preguntaAbierta') {
      this.dialogRef.close();
    } else if (this.typeQuestion === 'pausa') {
      this.dialogRef.close();
    }
  }

  getQuestion() {
    if (this.data.idMarca !== undefined) {
      console.log("ID MARCA A CONSULTAR ", this.data.idMarca);
      this.activityService.getActivityById(this.data.idMarca).subscribe(
        data => {
          let results = []
          data.forEach(o => {
            results = results.concat(o.body.results)
          });
          this.arrayQuestionsForMark = results;
          console.log(results)
          this.getQuestionToShow();
        },
        error => {
          console.log("Error getting question information -> ", error);
        }
      );
    }
  }

  checkOptionAnswer(value, idOptionSelected) {
    this.optionsArray.forEach(answer => {
      if (answer.idOption === idOptionSelected) {
        answer.answerOption = value;
      } else if (!this.hasManyOptions) {
        answer.answerOption = false;
      }
    });
  }

  generateArrayOptions(arrayOptions: Array<OpcionesPreguntaMultiple>, idQ) {
    this.idQuestion = idQ;
    this.optionsArray = new Array();
    arrayOptions.forEach(option => {
      this.optionsArray.push(
        { idOption: option.id, idQuestion: idQ, answerOption: false, titleOption: option.opcion });
    });
  }

  generateArrayCorrectAnswers(arrayOptions: Array<OpcionesPreguntaMultiple>) {
    this.arrayCorrectAnswers = new Array();
    arrayOptions.forEach(option => {
      if (option.esCorrecta) {
        this.arrayCorrectAnswers.push({ titleAnswer: option.opcion });
      }
    });
  }

  getQuestionToShow() {
    this.arrayQuestionsForMark.forEach((element, index) => {
      if (this.indexToShow === index) {
        this.typeQuestion = element.type;
        if (this.typeQuestion === 'preguntaOpcionMultiple') {
          this.questionInformation = new PreguntaOpcionMultiple
            (null, element.enunciado, element.esMultipleResp, element.opciones, element.tieneRetroalimentacion);
          this.hasManyOptions = element.esMultipleResp;
          this.generateArrayOptions(this.questionInformation.opciones, element.id);
          this.generateArrayCorrectAnswers(this.questionInformation.opciones);
        } else if (this.typeQuestion === 'preguntaAbierta') {
          this.idQuestion = element.id;
          this.questionInformation = element;
          this.questionInformation.respuesta = '';
          this.hasFeedBack = false;
        } else if (this.typeQuestion === 'pausa') {
          this.time = element.tiempo;
          this.idQuestion = element.id;
          this.questionInformation = element;
          this.questionInformation.respuesta = '';
          this.hasFeedBack = false;
          let id = setInterval(() => {
            this.time = this.time - 1;
          }, 1000)
          this.sleep(element.tiempo * 1000).then(() => {
            this.continue();
            clearInterval(id);
          });
        }
      }
    });
    this.hasQuestionsToShow = true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  callServiceSaveAnswer() {
    this.activityService.getLastTryByQuestion(this.idQuestion, this.studentId).subscribe(
      answerTries => {
        this.numberTry = answerTries.body.ultimo_intento + 1;
        if (this.typeQuestion === 'preguntaOpcionMultiple') {
          this.optionsArray.forEach(option => {
            if (option.answerOption) {
              const request = new AnswerQuestion(option.idOption, this.studentId, this.numberTry, this.idGroup, this.typeQuestion);
              this.activityService.postSaveAnswerQuestion(request).subscribe(
                data => {
                  console.log('success save answer ', data);
                }, error => {
                  console.log('Error save answer-> ', error);
                }
              );
            }
          });
        } else if (this.typeQuestion === 'preguntaAbierta') {
          const request = {
            intento: this.numberTry,
            estudiante: this.studentId,
            grupo: this.idGroup,
            respuesta: this.questionInformation.respuesta,
            preguntaAbierta: this.questionInformation.id,
            typeQuestion: this.typeQuestion
          }
          this.activityService.postSaveAnswerQuestion(request).subscribe(
            data => {
              console.log('success save answer ', data);
            }, error => {
              console.log('Error save answer-> ', error);
            }
          );
        }
      }, error => {
        console.log('Error getting question information -> ', error);
      }
    );

  }

}
