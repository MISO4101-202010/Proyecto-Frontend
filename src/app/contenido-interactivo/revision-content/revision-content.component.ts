import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService } from "src/app/services/activities-service/activities.service";
import { OpcionesPreguntaMultiple } from "src/app/models/mark/optionsQuestionMultiple.model";

@Component({
  selector: 'app-revision-content',
  templateUrl: './revision-content.component.html',
  styleUrls: ['./revision-content.component.css']
})
export class RevisionContentComponent implements OnInit {

  data;
  dataQuestions: Array<{
    name: string; 
    question: string; 
    arrayCorrectAnswers: Array<OpcionesPreguntaMultiple>
  }> = new Array();
  id: number;

  constructor(private contenidoService: ContenidoService,
     private activeRoute: ActivatedRoute,
     private activityService: ActivitiesService,) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.activeRoute.params.subscribe(params => {
      if (params.id !== undefined) {
        this.dataQuestions = [];
        this.id = params.id;
        this.contenidoService.getDetalleContenidoInteractivo(this.id).subscribe(dataresult => {
          this.data = dataresult;
          dataresult.marcas.forEach(mark => {
             this.getQuestion(mark.id);
          });
        });
      }
    });
  }

  getQuestion(idMarca) {
    let results = []
    this.activityService.getActivityById(idMarca).subscribe(
      data => {
        data.forEach(o => {           
          results = results.concat(o.body.results)
        });
        if(results!== undefined && results[0]!== undefined){
          let result = results[0];
          if(result.type !== 'pausa'){
            let arrayCorrect = []
            if(result.type === 'preguntaOpcionMultiple'){
              result.opciones.forEach(option => {
                if(option.esCorrecta === true){
                  arrayCorrect.push(
                    {idOption: option.id, idQuestion: result.id, answerOption: false, titleOption: option.opcion});
                  }
                }
              );
            }else if(result.type === 'preguntaAbierta'){
              arrayCorrect.push(
                {idOption: 0, idQuestion: result.id, answerOption: false, titleOption: 'No aplica'});
            }
            
            this.dataQuestions.push(
            {
                name: result.nombre, 
                question: result.enunciado,
                arrayCorrectAnswers: arrayCorrect
            });             
          }
        }
      },
      error => {
        console.log("Error getting question information -> ", error);
      }
    );

    this.activityService.getActivityFVById(idMarca).subscribe(
    data => {
      let arrayCorrect = []
      console.log(data.body);

      arrayCorrect.push({idOption: 0, idQuestion: data.body.id, answerOption: false, titleOption: data.body.esVerdadero?'Verdadero':'Falso'});
        
      this.dataQuestions.push(
          {
            name: data.body.nombre,
            question: data.body.pregunta,
            arrayCorrectAnswers: arrayCorrect
          });
      }, error => {
        console.log('Error getting question information -> ', error);
      }
    );
  }         
}
