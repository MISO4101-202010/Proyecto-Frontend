import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { InteraccionAlumnoService } from "../interaccion-alumno.service";
import { ActivatedRoute } from "@angular/router";
import { LoadVideoService } from "../services/contenidoInter/load-video.service";
import { MatDialog } from "@angular/material/dialog";
import { QuestionModalComponent } from "src/app/contenido-interactivo/question-modal/question-modal.component";
import { ContenidoService } from "../services/contenido.service";

@Component({
  selector: "app-video-alumno",
  templateUrl: "./video-alumno.component.html",
  styleUrls: ["./video-alumno.component.css"]
})
export class VideoAlumnoComponent {
  player: YT.Player;
  idContent = "";
  retroalimentacion: string;
  id = "";
  marcas: any[];
  dosperro = 999999;
  progressBarValue = 0;
  playing = false;
  playerVars = {
    // Oculta la barra de reproducción (0)
    controls: 0,
    playsinline: 1,
    modestbranding: 1,
    enablejsapi: 1,
    disablekb: 1,
    showinfo: 0,
  };
  waiting = false;
  counter = 0;
  contentsLoaded: Promise<boolean>;
  marcasPorcentaje;
  contenidoInt;
  isVideoLinear: boolean;

  @ViewChild("progressBar", { static: false }) progressBar: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private retroalimentacionService: InteraccionAlumnoService,
    public dialog: MatDialog,
    private contentService: LoadVideoService,
    private contenidoService: ContenidoService
  ) {
    this.loadData();
  }

  

  loadData() {
    console.log("POST call successful value returned in body on init");
    const idPregunta = 1;
    this.retroalimentacionService
      .getRetroOpMultiple(idPregunta)
      .subscribe((data: any[]) => {
        console.log(data);
        //this.retroalimentacion = data[0].respuesta;
      });

    this.activatedRoute.params.subscribe(params => {
      this.idContent = params["id"] ? params["id"] : "";
      this.getContentInteractiveDetail(this.idContent);
    });
  }

  async savePlayer(player) {
    this.player = player;
    console.log("player instance", player);
    this.getContentMark();
    this.loadMarcas(this.contenidoInt.marcas);

    await console.log("player currenttime", this.player.getCurrentTime());
    //console.log('player nnn', this.marcas[i].punto);
    while (1 == 1) {
      this.dosperro = 999999;
      await this.delay(1000);
      console.log(
        "player currenttime",
        Math.round(this.player.getCurrentTime())
      );
      for (let i = 0; i < this.marcas.length; i++) {
        if (Math.round(this.player.getCurrentTime()) === this.marcas[i].punto) {
          this.player.pauseVideo();

          await this.open(this.marcas[i]);
          while (this.dosperro == 999999) {
            await this.delay(1000);
          }
        }
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  open(marca: any) {
    const dialogRef = this.dialog.open(QuestionModalComponent, {
      width: "70%",
      data: {
        idActivity: "1",
        idMarca: marca.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.player.playVideo();
      this.dosperro = 1;
    });
  }

  getContentMark() {
    this.retroalimentacionService
      .getMarcasXacontenido(parseInt(this.idContent, 10))
      .subscribe(
        (val: any) => {
          this.marcas = val.results;
          console.log("POST call successful value returned in body", val);
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        }
      );
  }

  getContentInteractiveDetail(idContent) {
    if (idContent !== undefined) {
      this.contenidoService.getDetalleContenidoInteractivo(idContent).subscribe(
        contenido => {
          //True si el video es solo lineal y no se puede saltar entre marcas, false de lo contrario
          contenido.linear = true;
          this.isVideoLinear = contenido.linear;
          this.contenidoInt = contenido;
          this.id = contenido.contenido.url.split("watch?v=")[1];
          this.contentsLoaded = Promise.resolve(true);
          console.log("contenido alumno", contenido);
          console.log("idd", this.id);
          if (this.isVideoLinear) {
            this.progressBar.nativeElement.disabled = true;
          }
        },
        error => {
          console.log("Error getting question information -> ", error);
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
    const timeUpdateInterval = setInterval(() => {
      this.updateProgressBar();
    }, 500);
  }

  // Actualiza el estado de la barra de reproducción cuando se navega
  public updateProgressBar(): void {
    this.progressBarValue =
      (this.player.getCurrentTime() / this.player.getDuration()) * 100;
    // this.progressBar.nativeElement.value = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
  }

  handleTouchProgressBar(e: any): void {
    if (!this.isVideoLinear) {
      // Calculate the new time for the video.
      // new time in seconds = total duration in seconds * ( value of range input / 100 )
      const newTime = this.player.getDuration() * (e / 100);

      // Skip video to new time
      this.player.seekTo(newTime, true);
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
      return "0:00";
    }
  }

  getTotalTime(): string {
    if (this.player) {
      return this.toMin(this.player.getDuration());
    } else {
      return "0:00";
    }
  }

  toMin(sec: number): string {
    const result = Math.round(sec);
    let resultStr = "0:00" + result;
    let newSec = (result % 60).toString();
    if (+newSec < 10) {
      newSec = "0" + newSec;
    }
    if (sec > 59) {
      let min = Math.floor(result / 60).toString();
      if (+min < 10) {
        min = "0" + min;
      }
      resultStr = min + ":" + newSec;
    } else {
      resultStr = "0:" + newSec;
    }
    return resultStr;
  }
}
