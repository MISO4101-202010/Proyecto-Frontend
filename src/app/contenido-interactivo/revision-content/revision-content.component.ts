import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from 'src/app/services/activities-service/activities.service';
import { OpcionesPreguntaMultiple } from 'src/app/models/mark/optionsQuestionMultiple.model';
import * as _ from 'underscore';

enum questionTypes {
  OPEN_QUESTION = 'preguntaAbierta',
  MULTIPLE_SELECTION = 'preguntaOpcionMultiple',
  PAUSE = 'pausa',
}

interface DataQuestions {
  name: string;
  question: string;
  arrayCorrectAnswers: OpcionesPreguntaMultiple[];
  type: string;
  qualification: number;
  alreadyQualified: boolean;
}

@Component({
  selector: 'app-revision-content',
  templateUrl: './revision-content.component.html',
  styleUrls: ['./revision-content.component.css'],
})
export class RevisionContentComponent implements OnInit {
  data;
  dataQuestions: DataQuestions[] = [];
  id: number;
  total = 0;
  goodAnswers = 0.0;

  constructor(
    private contenidoService: ContenidoService,
    private activeRoute: ActivatedRoute,
    private activityService: ActivitiesService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const { id } = this.activeRoute.snapshot.params;
    if (id) {
      this.dataQuestions = [];
      this.id = id;
      this.contenidoService
        .getDetalleContenidoInteractivo(this.id)
        .subscribe((dataResult) => {
          this.data = dataResult;
          dataResult.marcas.forEach((mark) => this.getQuestion(mark.id));
        });
    }
  }

  async getQuestion(idMarca) {
    await this.getGeneralQuestions(idMarca);
    await this.getFvQuestions(idMarca);
    return;
  }

  getQualification(result): number {
    return result.qualification
      ? result.qualification
      : 0;
  }

  isAlreadyQualified(result): boolean {
    return result.qualification;
  }

  getTotal() {
    if (this.dataQuestions) {
      const allQualifications = _.reduce(
        this.dataQuestions,
        (acumulado, dq) => acumulado + dq.qualification,
        0,
      );

      this.total =
        Math.round((allQualifications / this.dataQuestions.length) * 100) / 100;
      this.goodAnswers =
        Math.round(((this.total * this.dataQuestions.length) / 100) * 100) /
        100;
    }
  }

  getGeneralQuestions(idMarca) {
    return this.activityService
      .getActivityById(idMarca)
      .toPromise()
      .then(
        (data) => {
          let results = [];
          data.forEach((o) => {
            results = results.concat(o.body.results);
          });
          if (results && results[0]) {
            results = results.filter(
              (result) => result.type !== questionTypes.PAUSE,
            );
            const result = results[0];
            this.dataQuestions.push(this.handleGeneralQuestion(result));
          }
        },
        (error) => console.log('Error getting question information -> ', error),
      );
  }

  getFvQuestions(idMarca) {
    return this.activityService
      .getActivityFVById(idMarca)
      .toPromise()
      .then(
        (data) => {
          this.dataQuestions.push(this.handleFVQuestion(data));
          this.getTotal();
        },
        (error) => console.log('Error getting question information -> ', error),
      );
  }

  handleFVQuestion(data: any): DataQuestions {
    const arrayCorrect = [];
    const { id, esVerdadero, nombre, pregunta, type } = data.body;
    arrayCorrect.push({
      idOption: 0,
      idQuestion: id,
      answerOption: false,
      titleOption: esVerdadero ? 'Verdadero' : 'Falso',
    });
    return {
      name: nombre,
      question: pregunta,
      arrayCorrectAnswers: arrayCorrect,
      type,
      qualification: this.getQualification(data.body),
      alreadyQualified: this.isAlreadyQualified(data.body),
    };
  }

  handleGeneralQuestion(result: any): DataQuestions {
    const { nombre, enunciado } = result;
    const dataQuestion: DataQuestions = {
      name: nombre,
      question: enunciado,
      arrayCorrectAnswers: [],
      type: result.type,
      qualification: this.getQualification(result),
      alreadyQualified: this.isAlreadyQualified(result),
    };
    switch (result.type) {
      case questionTypes.MULTIPLE_SELECTION:
        const { opciones, id } = result;
        dataQuestion.arrayCorrectAnswers = this.handleMultipleSelectionQuestion(
          opciones,
          id,
        );
        break;
      case questionTypes.OPEN_QUESTION:
        dataQuestion.arrayCorrectAnswers = this.handleOpenQuestion(result.id);
        break;
      default:
        break;
    }
    return dataQuestion;
  }

  isOpenQuestion(type) {
    return type === questionTypes.OPEN_QUESTION;
  }

  handleMultipleSelectionQuestion(
    options: any[],
    idQuestion,
  ): OpcionesPreguntaMultiple[] {
    const arrayCorrectAnswers = [];
    options
      .filter((option) => option.esCorrecta)
      .forEach((option) => {
        arrayCorrectAnswers.push({
          idQuestion,
          answerOption: false,
          idOption: option.id,
          titleOption: option.opcion,
        });
      });
    return arrayCorrectAnswers;
  }

  handleOpenQuestion(idQuestion): OpcionesPreguntaMultiple[] {
    const arrayCorrectAnswers = [];
    arrayCorrectAnswers.push({
      idOption: 0,
      idQuestion,
      answerOption: false,
      titleOption: 'No aplica',
    });
    return arrayCorrectAnswers;
  }
}
