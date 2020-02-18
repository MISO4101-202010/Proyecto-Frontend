import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CrearSeleccionMultipleComponent } from './crear-seleccion-multiple/crear-seleccion-multiple.component';
import { CrearPreguntaAbiertaComponent } from './crear-pregunta-abierta/crear-pregunta-abierta.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ContenidoService } from 'src/app/services/contenido.service';

const activityTypesComponents = {
  'Pregunta de opción múltiple': CrearSeleccionMultipleComponent,
  'Pregunta abierta': CrearPreguntaAbiertaComponent
};

@Component({
  selector: 'app-configurar-contenido-interactivo',
  templateUrl: './configurar-contenido-interactivo.component.html',
  styleUrls: ['./configurar-contenido-interactivo.component.css']
})
export class ConfigurarContenidoInteractivoComponent implements AfterViewInit {

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
  values = [1, 3, 5, 10, 20, 50, 100];    // values to step to
  contenidoInt;
  contId;
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;

  // Elementos del DOM a manipular
  @ViewChild('progressBar', { static: false }) progressBar: ElementRef;
  constructor(public dialog: MatDialog, private activeRoute: ActivatedRoute,
    private contenidoService: ContenidoService) {
    this.loadData();
  }

  // // Escuchar evento cuando se mueve la barra
  // @HostListener('window:mouseup', ['$event'])
  // onMouseUp(event) {
  //   if (event.target.id === 'progressBar') {
  //     this.handleTouchProgressBar(event);
  //   }
  // }

  opcionesMarca = [
    'Pregunta de opción múltiple',
    'Pregunta Falso o Verdadero',
    'Pregunta abierta',
    'Pausa',
    //'Foro'
  ];
  marcaSeleccionada = this.opcionesMarca[0];

  ngAfterViewInit() {
  }

  savePlayer(player) {
    this.player = player;
    // Update the controls on load
    this.updateProgressBar();
    this.loadMarcas(this.contenidoInt.marcas);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    const timeUpdateInterval = setInterval(() => {
      this.updateProgressBar();
    }, 1000);

    // Clear any old interval.
    clearInterval(timeUpdateInterval);
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
    }, 500);

  }

  // Actualiza el estado de la barra de reproducción cuando se navega
  public updateProgressBar(): void {
    this.progressBarValue = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
    // this.progressBar.nativeElement.value = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
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
    this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.contId = params.id;
        this.getContIntDetail();
      }
    });
  }

  getContIntDetail() {
    this.contenidoService.getDetalleContenidoInteractivo(this.contId).subscribe(contenido => {
      this.contenidoInt = contenido;
      this.contentsLoaded = Promise.resolve(true);
      this.loadMarcas(this.contenidoInt.marcas);
      this.id = this.contenidoInt.contenido.url.split('watch?v=')[1];
    });
  }

  loadMarcas(marcas) {
    this.marcasPorcentaje = [];
    for (const marca of marcas) {
      console.log(marca);
      const marcaP = Math.round(this.calcPercentage(+marca.punto));
      console.log(marcaP, 'marcaP');
      this.marcasPorcentaje.push(marcaP);
    }
    console.log(this.marcasPorcentaje, 'marcasPorcentaje');
  }

  calcPercentage(segundo: number) {
    let percentage = 0;
    if (this.player) {
      percentage = (Math.round(segundo) * 100) / Math.round(this.player.getDuration());
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
    let resultStr = '0:00' +  result;
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



  addMarker() {
    this.pause();
    // Por ahora solo se  podría selección multiple
    console.log('Añadir marca en', this.player.getCurrentTime());
    if (this.contId) {
      const punto = Math.round(this.player.getCurrentTime());
      const marca = {
        nombre: 'marca ' + this.getCurrentTime(),
        punto,
        contenido_id: +this.contId
      };
      this.openDialog(marca);
    }
  }
  openDialog(marca): void {
    const dialogRef = this.dialog.open(activityTypesComponents[this.marcaSeleccionada], {
      width: '70%',
      data: {
        marca
      }
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.getContIntDetail();
     });
  }
}
