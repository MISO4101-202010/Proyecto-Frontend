import { Component } from '@angular/core';
import { CrearSeleccionMultipleComponent } from './crear-seleccion-multiple/crear-seleccion-multiple.component';
import { CrearPreguntaAbiertaComponent } from './crear-pregunta-abierta/crear-pregunta-abierta.component';
import { CrearPreguntaVerdaderoFalsoComponent } from './crear-pregunta-verdadero-falso/crear-pregunta-verdadero-falso.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ContenidoService } from 'src/app/services/contenido.service';
import { CrearPreguntaPausaComponent } from './crear-pregunta-pausa/crear-pregunta-pausa.component';
import { InteraccionAlumnoService } from '../../interaccion-alumno.service';
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
              private interaccionAlumnoService: InteraccionAlumnoService) {
    this.loadData();
  }

  opcionesMarca = [{
    text: 'Pregunta de selección múltiple',
    value: 1,
    modalType: CrearSeleccionMultipleComponent
  }, {
    text: 'Pregunta falso o verdadero',
    value: 2,
    modalType: CrearPreguntaVerdaderoFalsoComponent
  }, {
    text: 'Pregunta tipo pausa',
    value: 3,
    modalType: CrearPreguntaPausaComponent
  }, {
    text: 'Pregunta abierta',
    value: 4,
    modalType: CrearPreguntaAbiertaComponent
  }];
  marcaSeleccionada = this.opcionesMarca[0];

  savePlayer(player) {
    this.player = player;
    // Update the controls on load
    this.updateProgressBar();
    this.getContentMark();
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
        this.getContentInteractiveDetail(params.id);
      }
    });
  }

  getContentInteractiveDetail(contenidoInteractivoId) {
    this.contenidoService.getDetalleContenidoInteractivo(contenidoInteractivoId).subscribe(contenido => {
      this.contenidoInteractivo = contenido;
      this.contentsLoaded = Promise.resolve(true);
      this.loadMarcas(this.contenidoInteractivo.marcas);
      this.videoId = this.contenidoInteractivo.contenido.url.split('watch?v=')[1];
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
      // Buscar la marca correcta
      // tslint:disable-next-line:only-arrow-functions
      const selectedMark = _.filter(this.marcas, function(m) {
        return m.marca_id === mark.id;
      })[0];
      console.log('Editar marca:', selectedMark);
      this.openDialog(selectedMark);
    } else {
      console.log('Añadir marca en', this.player.getCurrentTime());
      if (this.contenidoInteractivo) {
        const punto = this.player.getCurrentTime();
        const newMark = {
          nombre: 'marca ' + this.getCurrentTime(),
          punto,
          contenido_id: +this.contenidoInteractivo.id,
          tipoActividad: undefined,
          marca_id: undefined
        };
        this.openDialog(newMark);
      }
    }
  }

  openDialog(marca): void {
    let modalType;
    if (marca.tipoActividad === undefined) {
      modalType = this.marcaSeleccionada.modalType;
    } else {
      // tslint:disable-next-line:only-arrow-functions
      modalType = _.filter(this.opcionesMarca, function(opc) {
        return opc.value === marca.tipoActividad;
      })[0].modalType;
    }
    const dialogRef = this.dialog.open(modalType, {
      width: '70%',
      data: {
        marca
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.getContentInteractiveDetail(this.contenidoInteractivo.id);
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
    this.interaccionAlumnoService.getMarcasXacontenido(parseInt(this.contenidoInteractivo.id, 10))
    .subscribe(
      (val: any) => {
        this.marcas = val.results;
      },
      response => {
        console.log('Error obteniendo las marcas', response);
      },
      () => {
        console.log('Proceso de obtención de las marcas completado');
      }
    );
  }
}
