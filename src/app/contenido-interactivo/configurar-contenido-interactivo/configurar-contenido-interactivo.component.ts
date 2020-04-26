import { Component } from '@angular/core';
import { CrearSeleccionMultipleComponent } from './crear-seleccion-multiple/crear-seleccion-multiple.component';
import { CrearPreguntaAbiertaComponent } from './crear-pregunta-abierta/crear-pregunta-abierta.component';
import { CrearPreguntaVerdaderoFalsoComponent } from './crear-pregunta-verdadero-falso/crear-pregunta-verdadero-falso.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ContenidoService } from 'src/app/services/contenido.service';
import { CrearPreguntaPausaComponent } from './crear-pregunta-pausa/crear-pregunta-pausa.component';
import {InteraccionAlumnoService} from '../../interaccion-alumno.service';
import {ActivitiesService} from '../../services/activities-service/activities.service';

const activityTypesComponents = {
  'Pregunta de opción múltiple': CrearSeleccionMultipleComponent,
  'Pregunta abierta': CrearPreguntaAbiertaComponent,
  'Pregunta Falso o Verdadero': CrearPreguntaVerdaderoFalsoComponent,
  'Pregunta tipo pausa': CrearPreguntaPausaComponent
};

@Component({
  selector: 'app-configurar-contenido-interactivo',
  templateUrl: './configurar-contenido-interactivo.component.html',
  styleUrls: ['./configurar-contenido-interactivo.component.css']
})
export class ConfigurarContenidoInteractivoComponent {
  player: YT.Player;
  id: string;
  playerVars = {
    // Oculta la barra de reproducción (0)
    controls: 0,
    playsinline: 1,
    modestbranding: 1,
    enablejsapi: 1
  };
  playing = false;
  progressBarValue = 0;
  contenidoInt;
  contId;
  marcas: any[];
  selected: any;
  questionSelected: any;
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,
              private contenidoService: ContenidoService,
              private retroalimentacionService: InteraccionAlumnoService,
              private activityService: ActivitiesService) {
    this.loadData();
  }

  opcionesMarca = [
    'Pregunta tipo pausa',
    'Pregunta de opción múltiple',
    'Pregunta Falso o Verdadero',
    'Pregunta abierta',
    'Pausa',
    // 'Foro'
  ];
  marcaSeleccionada = this.opcionesMarca[0];

  ngAfterViewInit() {
  }

  savePlayer(player) {
    this.player = player;
    // Update the controls on load
    this.updateProgressBar();
    this.loadMarcas(this.contenidoInt.marcas);
  }

  onStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      this.playing = true;
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.playing = false;
    }
    this.updateProgressBar();
    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    const timeUpdateInterval = setInterval(() => {
      this.updateProgressBar();
    }, 1000);
  }

  // Actualiza el estado de la barra de reproducción cuando se navega
  public updateProgressBar(): void {
    this.progressBarValue = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
  }

  handleTouchProgressBar(e: any): void {
    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    const newTime = this.player.getDuration() * (e / 100);

    // Skip video to new time
    this.player.seekTo(newTime, true);
  }

  play(): void {
    if (!this.playing) {
      this.playing = true;
      this.player.playVideo();
    }
  }

  pause(): void {
    if (this.playing) {
      this.player.pauseVideo();
      this.playing = false;
    }
  }

  loadData() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.contId = params.id;
        this.getContentInteractiveDetail();
      }
    });
  }

  getContentInteractiveDetail() {
    this.contenidoService.getDetalleContenidoInteractivo(this.contId).subscribe(contenido => {
      this.contenidoInt = contenido;
      this.loadMarcas(this.contenidoInt.marcas);
      this.getContentMark();
      this.contentsLoaded = Promise.resolve(true);
      this.id = this.contenidoInt.contenido.url.split('watch?v=')[1];
    });
  }

  loadMarcas(marcas) {
    this.marcasPorcentaje = [];
    for (const marca of marcas) {
      const marcaP = this.calcPercentage(+marca.punto);
      this.marcasPorcentaje.push(marcaP);
    }
  }

  calcPercentage(segundo: number) {
    let percentage = 0;
    if (this.player) {
      percentage = (segundo * 100) / this.player.getDuration();
    }
    return percentage;
  }

  getCurrentTime(): string {
    if (this.player) {
      return this.toMin(this.player.getCurrentTime());
    } else {
      return '0:00';
    }
  }

  getTotalTime(): string {
    if (this.player) {
      return this.toMin(this.player.getDuration());
    } else {
      return '0:00';
    }
  }

  toMin(sec: number): string {
    const result = Math.round(sec);
    let resultStr = '0:00' + result;
    let newSec = (result % 60).toString();
    if (+newSec < 10) {
      newSec = '0' + newSec;
    }
    if (sec > 59) {
      let min = Math.floor(result / 60).toString();
      if (+min < 10) {
        min = '0' + min;
      }
      resultStr = min + ':' + newSec;
    } else {
      resultStr = '0:' + newSec;
    }
    return resultStr;
  }

  getMarcaSelected(pregunta): any {
    //SI EXISTE ACTUALIZA
    if(pregunta) {
      switch(pregunta[0].type) { 
        case 'preguntaOpcionMultiple': { 
           return CrearSeleccionMultipleComponent;
          } 
          case 'preguntaAbierta': { 
            return CrearPreguntaAbiertaComponent;
          } 
          case 'pausa': { 
            return CrearPreguntaPausaComponent;
        } 
        case 'preguntaFV': { 
          return CrearPreguntaVerdaderoFalsoComponent;
          } 
      } 
      //SI NO EXISTE CREA
    } else {
      return activityTypesComponents[this.marcaSeleccionada];
    } 
  }

  async addMarker(pregunta?) {
    this.player.pauseVideo();
    // Por ahora solo se podría selección multiple

    if (pregunta !== undefined) {
          await console.log('Añadir marca en', this.player.getCurrentTime());
          for (let i = 0; i < this.marcas.length; i++) {
            if (pregunta.id === this.marcas[i].marca_id) {
              this.selected = this.marcas[i];
              break;
            }
          }
          await this.getInfoQuestion();
          while (this.questionSelected === undefined) {
            await this.delay(500);
          }
    }

    if (this.contId) {
      const punto = this.player.getCurrentTime();
      const marca = {
        nombre: this.selected ? this.selected.nombre : 'marca ' + this.getCurrentTime(),
        punto,
        contenido_id: +this.contId,
        pregunta: this.questionSelected
      };
      this.openDialog(marca);
    }
  }



  openDialog(marca?): void {
    const dialogRef = this.dialog.open(this.getMarcaSelected(marca.pregunta), {
      width: '70%',
      data: {
        marca
      }
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.getContentInteractiveDetail();
     });
  }

  getDuration(punto): string {
    if (this.player) {
      const seconds = this.player.getDuration() * punto / 100;
      return this.toMin(seconds);
    }
    return '0';
  }

  getPosition(punto): number {
    // Cantidad de puntos a restar para ubicar la marca, los "10" son el tamaño de la marca
    const pixelsToRest = (punto * 10 / 100);
    return (punto * 854 / 100) - pixelsToRest;
  }

   getContentMark() {
     this.retroalimentacionService
      .getMarcasXacontenido(this.contId)
      .subscribe(
        (val: any) => {
          this.marcas = val.results;
          this.contentsLoaded = Promise.resolve(true);
          console.log('POST call successful value returned in body', val);
        },
        response => {
          console.log('POST call in error', response);
        },
        () => {
          console.log('The POST observable is now completed.');
        }
      );
     this.selected = undefined;
     this.questionSelected = undefined;
  }

  getInfoQuestion() {
    console.log('info data', this.selected);
    if (this.selected.tipoActividad === 2) {
      this.activityService.getActivityFVById(this.selected.marca_id).subscribe(
        data => {
          this.questionSelected = [data.body];
        }, error => {
          console.log('Error getting question information -> ', error);
        }
      );
    } else {
      this.activityService.getActivityById(this.selected.marca_id).subscribe(
        data => {
          let results = [];
          data.forEach(o => {
            results = results.concat(o.body.results);
          });
          console.log(results);
          this.questionSelected = results;
        },
        error => {
          console.log('Error getting question information -> ', error);
        }
      );
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
