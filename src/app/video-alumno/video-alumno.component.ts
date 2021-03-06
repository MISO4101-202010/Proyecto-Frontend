import {Component} from '@angular/core';
import {InteraccionAlumnoService} from '../interaccion-alumno.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadVideoService} from '../services/contenidoInter/load-video.service';
import {MatDialog} from '@angular/material/dialog';
import {QuestionModalComponent} from 'src/app/contenido-interactivo/question-modal/question-modal.component';
import {ContenidoService} from '../services/contenido.service';
import {QuestionVFComponent} from '../contenido-interactivo/question-v-f/question-v-f.component';
import Swal from 'sweetalert2';
import {VideoStateHandler} from './video-state-handler.service';
import {distinctUntilChanged, filter, take, takeUntil} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';

@Component({
  selector: 'app-video-alumno',
  templateUrl: './video-alumno.component.html',
  styleUrls: ['./video-alumno.component.css']
})
export class VideoAlumnoComponent {
  player: YT.Player;
  videoId = '';
  marcas: any[];
  public progressBarValue = 0;
  playing = false;
  playerVars = {
    // Oculta la barra de reproducción (0)
    controls: 0,
    playsinline: 1,
    modestbranding: 1,
    enablejsapi: 1,
    disablekb: 1,
    showinfo: 0
  };
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;
  contenidoInteractivo;
  isVideoLineal: boolean;
  interval$: Observable<any> = interval(1000);

  constructor(
    private activatedRoute: ActivatedRoute,
    private interaccionAlumnoService: InteraccionAlumnoService,
    public dialog: MatDialog,
    private contentService: LoadVideoService,
    private contenidoService: ContenidoService,
    private videoStateHandler: VideoStateHandler,
    public router: Router
  ) {
    this.loadData();
  }

  loadData() {
    const idPregunta = 1;
    this.interaccionAlumnoService.getRetroOpMultiple(idPregunta).subscribe((data: any[]) => {
      console.log(data);
    });
    this.activatedRoute.params.subscribe(params => {
      this.getContentInteractiveDetail(params.id ? params.id : '');
    });

  }

  async savePlayer(player) {
    this.player = player;
    this.videoStateHandler.reset();
    this.getContentMark().subscribe(
      (val: any) => {
        this.marcas = val;
        this.loadMarcas(this.contenidoInteractivo.marcas);
        this.initVideoStateHandler();
        this.videoStateHandler.handleVideoState();
        this.listenToEndOfVideo();
      },
      response => {
        console.log('POST call in error', response);
      },
      () => {
        console.log('The POST observable is now completed.');
      }
    );
  }

  open(marca: any) {
    let dialogRef;
    if (marca.tipoActividad === 2) {
      dialogRef = this.dialog.open(QuestionVFComponent, {
        width: '70%',
        data: {
          marca,
          contenidoInteractivo: this.contenidoInteractivo
        }
      });
    } else {
      dialogRef = this.dialog.open(QuestionModalComponent, {
        width: '70%',
        data: {
          idActivity: '1',
          idMarca: marca.marca_id,
          contenidoInteractivo: this.contenidoInteractivo
        }
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      this.player.playVideo();
      this.videoStateHandler.modalOpened$.next(false);
    });
  }

  getContentMark() {
    return this.interaccionAlumnoService
      .getMarcasXacontenido(this.contenidoInteractivo.id);
  }

  getContentInteractiveDetail(contenidoInteractivoId) {
    if (contenidoInteractivoId !== undefined) {
      this.contenidoService.getDetalleContenidoInteractivo(contenidoInteractivoId).subscribe(
        contenido => {
          this.isVideoLineal = !contenido.puedeSaltar;
          this.contenidoInteractivo = contenido;
          this.videoId = contenido.contenido.url.split('watch?v=')[1];
          this.contentsLoaded = Promise.resolve(true);
          console.log('Contenido interactivo alumno', contenido);
          console.log('Video ID', this.videoId);
        },
        error => {
          console.log('Error getting question information -> ', error);
        }
      );
    }
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
    setInterval(() => {
      this.updateProgressBar();
    }, 1000);
  }

  // Actualiza el estado de la barra de reproducción cuando se navega
  updateProgressBar(): void {
    this.progressBarValue = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
  }

  handleTouchProgressBar(e: any): void {
    if (!this.isVideoLineal) {
      // Calculate the new time for the video.
      // new time in seconds = total duration in seconds * ( value of range input / 100 )
      const newTime = this.player.getDuration() * (e / 100) - 0.1;

      // Skip video to new time
      this.player.seekTo(newTime, true);
    } else {
      Swal.fire('Oops...', 'No se le permite saltar en el video', 'warning');
    }
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

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async openFeedBack() {
    await this.delay(1000);
    this.videoStateHandler.modalOpened$.pipe(
      filter(value => !value),
      take(1))
      .subscribe(() => this.router.navigate(['/contenido-interactivo/revision/' + this.contenidoInteractivo.id]));
  }

  initVideoStateHandler() {
    this.videoStateHandler.init(this.marcas, this.player);
    return this.videoStateHandler.mustOpenMark$.pipe(takeUntil(this.videoStateHandler.reset$))
      .subscribe(mark => {
        this.open(mark);
      });
  }

  listenToEndOfVideo() {
    return this.videoStateHandler.isFinished$.pipe(
      takeUntil(this.videoStateHandler.reset$),
      distinctUntilChanged()
    ).subscribe(finished => {
      if (finished && this.contenidoInteractivo.es_calificable) {
        return this.openFeedBack();
      }
    });
  }
}
