import { Component } from '@angular/core';
import { CrearSeleccionMultipleComponent } from './crear-seleccion-multiple/crear-seleccion-multiple.component';
import { CrearPreguntaAbiertaComponent } from './crear-pregunta-abierta/crear-pregunta-abierta.component';
import { CrearPreguntaVerdaderoFalsoComponent } from './crear-pregunta-verdadero-falso/crear-pregunta-verdadero-falso.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ContenidoService } from 'src/app/services/contenido.service';
import { CrearPreguntaPausaComponent } from './crear-pregunta-pausa/crear-pregunta-pausa.component';
import { InteraccionAlumnoService } from '../../interaccion-alumno.service';
import { ActivitiesService } from '../../services/activities-service/activities.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-configurar-contenido-interactivo',
  templateUrl: './configurar-contenido-interactivo.component.html',
  styleUrls: ['./configurar-contenido-interactivo.component.css']
})
export class ConfigurarContenidoInteractivoComponent {
  player: YT.Player;
  videoId: string;
  playerVars = {
    // Oculta la barra de reproducción (0)
    controls: 0,
    playsinline: 1,
    modestbranding: 1,
    enablejsapi: 1
  };
  playing = false;
  progressBarValue = 0;
  marcas: any[];
  contenidoInteractivo;
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;

  constructor(public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private contenidoService: ContenidoService,
              private interaccionAlumnoService: InteraccionAlumnoService,
              private activityService: ActivitiesService) {
    this.loadData();
  }

  // Este arreglo necesita un refactor porque no necesita 'value' y 'type' al tiempo, solo uno de los dos es
  // necesario, 'value' y 'type' están retornando del backend.
  opcionesMarca = [{
    text: 'Pregunta de selección múltiple',
    value: 1,
    type: 'preguntaOpcionMultiple',
    modalType: CrearSeleccionMultipleComponent
  }, {
    text: 'Pregunta falso o verdadero',
    value: 2,
    type: 'preguntaFV',
    modalType: CrearPreguntaVerdaderoFalsoComponent
  }, {
    text: 'Pregunta tipo pausa',
    value: 3,
    type: 'pausa',
    modalType: CrearPreguntaPausaComponent
  }, {
    text: 'Pregunta abierta',
    value: 4,
    type: 'preguntaAbierta',
    modalType: CrearPreguntaAbiertaComponent
  }];
  tipoMarcaSeleccionada = this.opcionesMarca[0];

  savePlayer(player) {
    this.player = player;
    // Update the controls on load
    this.updateProgressBar();
    this.loadMarcas(this.contenidoInteractivo.marcas);
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
      this.player.pauseVideo();
      this.playing = false;
  }

  loadData() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.getContentInteractiveDetail(params.id, true);
      }
    });
  }

  private getContentInteractiveDetail(contenidoInteractivoId, firstCall) {
    this.contenidoService.getDetalleContenidoInteractivo(contenidoInteractivoId).subscribe(contenido => {
      this.contenidoInteractivo = contenido;
      this.loadMarcas(this.contenidoInteractivo.marcas);
      this.getContentMark();

      if (firstCall) {
        this.contentsLoaded = Promise.resolve(true);
        this.videoId = this.contenidoInteractivo.contenido.url.split('watch?v=')[1];
      }
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

  createOrUpdateMark(mark) {
    this.pause();
    if (mark) {
      // Buscar la marca correcta en la lista "marcas"
      // tslint:disable-next-line:only-arrow-functions
      const selectedMark = _.filter(this.marcas, function(m) {
        return m.marca_id === mark.id;
      })[0];
      this.setPreguntaToMark(selectedMark);
    } else {
      console.log('Añadir marca en', this.player.getCurrentTime());
      if (this.contenidoInteractivo) {
        const punto = this.player.getCurrentTime();
        const newMark = {
          nombre: 'marca ' + this.getCurrentTime(),
          punto,
          contenido_id: +this.contenidoInteractivo.id,
          tipoActividad: undefined,
          marca_id: undefined,
          pregunta: undefined
        };
        this.openDialog(newMark);
      }
    }
  }

  openDialog(marca): void {
    const modalType = this.getModalType(marca);
    const dialogRef = this.dialog.open(modalType, {
      width: '70%',
      data: {
        marca,
        tiene_retroalimentacion: this.contenidoInteractivo.tiene_retroalimentacion
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.getContentInteractiveDetail(this.contenidoInteractivo.id, false);
    });
  }

  // Este método necesita un refactor debido a que está buscando el tipo de modal para preguntas abierta, pausa
  // y selección múltiple y por el otro lado busca el tipo de modal para preguntas F/V
  private getModalType(marca): any {
    if (!(marca.pregunta === undefined)) {
      // Esto puede ser una pregunta abierta, pausa o selección múltiple
      // tslint:disable-next-line:only-arrow-functions
      return _.filter(this.opcionesMarca, function(opc) {
        return opc.type === marca.pregunta.type;
      })[0].modalType;
    } else if (!(marca.tipoActividad === undefined)) {
      // Esta es una pregunta V/F
      // tslint:disable-next-line:only-arrow-functions
      return _.filter(this.opcionesMarca, function(opc) {
        return opc.value === marca.tipoActividad;
      })[0].modalType;
    } else {
      // No se va a editar una pregunta, lo que se requiere es crear una nueva.
      // Por eso busca el valor en el combobox de 'Tipo de marca seleccionada'
      return this.tipoMarcaSeleccionada.modalType;
    }
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
    this.interaccionAlumnoService
    .getMarcasXacontenido(this.contenidoInteractivo.id)
    .subscribe(
      (val: any) => {
        this.marcas = val;
      },
      response => {
        console.log('Error obteniendo las marcas', response);
      },
      () => {
        console.log('Proceso de obtención de las marcas completado');
      }
    );
  }

  // Si la marca es de tipo actividad = 2, significa que es una pregunta F/V, es decir que no necesita una "pregunta",
  // en cambio, si el tipo actividad no es = 2, significa que puede ser una pregunta abierta, pausa o selección múltiple
  // y necesita una "pregunta"
  setPreguntaToMark(selectedMark): void {
    console.log('Editar marca:', selectedMark);
    if (selectedMark.tipoActividad === 2) {
      selectedMark.pregunta = undefined;
      this.openDialog(selectedMark);
    } else {
      this.activityService.getActivityById(selectedMark.marca_id).subscribe(
        data => {
          let results = [];
          data.forEach(o => {
            results = results.concat(o.body.results);
          });
          selectedMark.pregunta = results[0];
          this.openDialog(selectedMark);
        },
        error => {
          console.log('Error getting question information -> ', error);
        }
      );
    }
  }
}
