import {Component} from '@angular/core';
import {CrearSeleccionMultipleComponent} from './crear-seleccion-multiple/crear-seleccion-multiple.component';
import {CrearPreguntaAbiertaComponent} from './crear-pregunta-abierta/crear-pregunta-abierta.component';
import {CrearPreguntaVerdaderoFalsoComponent} from './crear-pregunta-verdadero-falso/crear-pregunta-verdadero-falso.component';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {ContenidoService} from 'src/app/services/contenido.service';
import {CrearPreguntaPausaComponent} from './crear-pregunta-pausa/crear-pregunta-pausa.component';
import {ViewportScroller} from '@angular/common';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

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
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;
  tiempoVideo = 0;
  marcasUbicadas = [];

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,
              private contenidoService: ContenidoService) {
    this.loadData();
  }

  opcionesMarca = [
    'Pregunta tipo pausa',
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
    if (this.marcasUbicadas.length > 0) {
      const tamanioContenedor = document.getElementById('lista-minutos').offsetWidth;
      const cantidadCuadros = Math.floor(tamanioContenedor / 11) - 1;
      const valorA = 'lista-' + (Math.round(this.player.getCurrentTime()) + cantidadCuadros);
      const valorB = 'lista-' + (Math.round(this.player.getCurrentTime()));
      if (document.getElementById(valorA) !== null && this.playing === true &&
        document.getElementById(valorB).scrollIntoView() !== null) {
        document.getElementById(valorA).scrollIntoView();
        document.getElementById(valorB).scrollIntoView();
      }
    }
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

  drop(event: CdkDragDrop<string[]>) {
    const marcaCambiar = this.marcasUbicadas[event.previousIndex];
    const marcaEnPos = this.marcasUbicadas[event.currentIndex];
    if (!marcaEnPos.conMarca) {
      this.contenidoService.actualizarMarca(marcaCambiar.idMarca, +this.contId, event.currentIndex, marcaCambiar.nombreMarca)
        .subscribe(res => {
          this.marcasUbicadas[event.previousIndex].segundo = this.marcasUbicadas[event.currentIndex].segundo;
          moveItemInArray(this.marcasUbicadas, event.previousIndex, event.currentIndex);
          Swal.fire('Pregunta Actualizada', 'La pregunta se movió satisfactoriamente', 'success');
        }, error => {
          console.error(error);
          Swal.fire('Oops...', 'Ocurrió un error actualizando la marca, por favor inténtalo de nuevo', 'error');
        });
    } else {
      Swal.fire('Oops...',
        'Ya hay una marca en la posición que seleccionaste, por favor inténtalo de nuevo en un espacio disponible',
        'error');
    }
  }

  actualizarVistaMarca() {
    const tiempoActual = Math.round(this.player.getCurrentTime());
    const moverse = tiempoActual * 10;
    const resultado = 'translateX(-' + moverse + 'px)';
    return resultado;
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
      this.contentsLoaded = Promise.resolve(true);
      // this.loadMarcas(this.contenidoInt.marcas);
      this.id = this.contenidoInt.contenido.url.split('watch?v=')[1];
    });
  }

  loadMarcas(marcas) {
    this.marcasPorcentaje = [];
    this.tiempoVideo = this.player.getDuration();
    let i = 0;
    while (i <= this.tiempoVideo) {
      const marcaIn = {
        texto: '',
        conMarca: false,
        segundo: i,
        idMarca: 0,
        nombreMarca: ''
      };
      this.marcasUbicadas.push(marcaIn);
      i++;
    }
    for (const marca of marcas) {
      const conMarca = {
        texto: '',
        conMarca: true,
        segundo: marca.punto,
        idMarca: marca.id,
        nombreMarca: marca.nombre
      };
      this.marcasUbicadas[marca.punto] = conMarca;
      const marcaP = this.calcPercentage(+marca.punto);
      this.marcasPorcentaje.push(marcaP);
    }
  }

  darEstiloMarca(marca) {
    if (marca) {
      return 'example-box-marca';
    } else {
      return 'example-box';
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

  addMarker() {
    this.pause();
    // Por ahora solo se podría selección multiple
    console.log('Añadir marca en', this.player.getCurrentTime());
    if (this.contId) {
      const punto = this.player.getCurrentTime();
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
}
