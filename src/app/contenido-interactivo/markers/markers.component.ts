import { Component, OnInit } from '@angular/core';
import { InterativeContentService } from 'src/app/services/interactive-content/interative-content.service';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css']
})
export class MarkersComponent implements OnInit {

  optionsMarkers: Array<{ name: string, id: string, active: boolean }> = new Array();
  markersAdded: Array<{ name: string }> = new Array();
  showBasicMarker = true;
  showManyAnswers = false;
  showSpecificAnswer = false;
  showComment = false;
  showForum = false;
  showQuestionnaire = false;
  showLink = false;
  shwowAnswerTrueFalse = false;

  constructor(private interativeContentService: InterativeContentService) { }

  ngOnInit() {
    this.setOptionsMarkers();
    this.getMarkersAdded();
  }

  setOptionsMarkers() {
    this.optionsMarkers.push({ name: 'Pregunta Abierta', id: 'specificAnswer', active: false });
    this.optionsMarkers.push({ name: 'Pregunta Falso o Verdadero', id: 'answerTrueFalse', active: false });
    this.optionsMarkers.push({ name: 'Pregunta Selección Múltiple', id: 'manyAnswers', active: false });
    this.optionsMarkers.push({ name: 'Comentario', id: 'comment', active: false });
    this.optionsMarkers.push({ name: 'Foro', id: 'forum', active: false });
    this.optionsMarkers.push({ name: 'Cuestionario', id: 'questionnaire', active: false });
    this.optionsMarkers.push({ name: 'Enlace', id: 'link', active: false });

  }

  getMarkersAdded() {
    this.markersAdded.push({ name: 'Marcador 1' });
    this.markersAdded.push({ name: 'Marcador 2' });
    this.markersAdded.push({ name: 'Marcador 3' });
    this.markersAdded.push({ name: 'Marcador 4' });
    this.markersAdded.push({ name: 'Marcador 5' });
  }

  addMark() {
    alert('Añadir Marca');
  }

  deleteMark() {
    alert('Borrar Marca');
  }

  preview() {
    alert('Vista previa');
  }

  redirectSpecificOption(idOption) {
    this.setFalseAllOptionsMarkers();
    switch (idOption) {
      case 'specificAnswer':
        this.showSpecificAnswer = true;
        break;
      case 'manyAnswers':
        this.showManyAnswers = true;
        break;
        case 'comment':
        this.showComment = true;
        break;
        case 'forum':
        this.showForum = true;
        break;
        case 'questionnaire':
        this.showQuestionnaire = true;
        break;
        case 'link':
        this.showLink = true;
        break;
        case 'answerTrueFalse':
          this.shwowAnswerTrueFalse = true;
          break;
      default:
        this.showBasicMarker = true;
        break;
    }

    this.optionsMarkers.forEach(element => {
      if (element.id === idOption) {
        element.active = true;
      } else {
        element.active = false;
      }
    });

  }


  saveInteractiveContent() {
    // contenido = models.ForeignKey(Contenido, blank=False, null=False, on_delete=models.CASCADE)
    // fecha_creacion = models.DateTimeField(null=False, auto_now_add=True)
    // tiempo_disponibilidad = models.DateTimeField(null=True, blank=True)
    // tiene_retroalimentacion = models.BooleanField()
    // curso = models.ForeignKey(Curso, blank=False, null=False, on_delete=models.CASCADE)
    const request = {
      contenido: 'algo',
      fecha_creacion: '',
      tiempo_disponibilidad: '',
      tiene_retroalimentacion: '',
      curso: ''
    };
    const url = 'http://127.0.0.1:8000/api/v1/cont_interactivo';
    this.interativeContentService.postGeneric(url, request).subscribe(
      response => {
        console.log('success');
      }, error => {
        console.log('fail');
      }
    );
  }

  saveMark() {
    const request = {
      nombre: 'algo',
      punto: 'algo',
      contenido: 'algo'
    };
    // nombre = models.CharField(max_length=30)
    // punto = models.IntegerField(default=0)
    // contenido = models.ForeignKey(ContenidoInteractivo, on_delete=models.CASCADE, related_name='marcas')
    const url = ' http://127.0.0.1:8000/api/v1/marca';
    this.interativeContentService.postGeneric(url, request).subscribe(
      response => {
        console.log('success');
      }, error => {
        console.log('fail');
      }
    );
  }

  saveActivity() {
    const request = {
      nombre: 'algo',
      numeroDeIntentos: 'algo',
      tieneRetroalimentacion: 'algo',
      marca: 'algo'
    };
    // nombre = models.CharField(max_length=30)
    // numeroDeIntentos = models.IntegerField(default=0)
    // tieneRetroalimentacion = models.BooleanField()
    // marca = models.ForeignKey(Marca, on_delete=models.CASCADE)

    const url = ' http://127.0.0.1:8000/api/v1/actividad';
    this.interativeContentService.postGeneric(url, request).subscribe(
      response => {
        console.log('success');
      }, error => {
        console.log('fail');
      }
    );
  }

  setFalseAllOptionsMarkers() {
    this.showBasicMarker = false;
    this.showComment = false;
    this.showForum = false;
    this.showLink = false;
    this.showManyAnswers = false;
    this.showQuestionnaire = false;
    this.showSpecificAnswer = false;
    this.showBasicMarker = false;
    this.shwowAnswerTrueFalse = false;
  }

}
