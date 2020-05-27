import { Component, OnInit } from '@angular/core';
import { CursoService } from '../../services/curso.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estudiante-cursos',
  templateUrl: './estudiante-cursos.component.html',
  styleUrls: ['./estudiante-cursos.component.css']
})
export class EstudianteCursosComponent implements OnInit {
  URL_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  cursos;
  constructor(private cursoService: CursoService, config: NgbCarouselConfig) {
    config.interval = 4000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.cursoService.getCursosEstudiante().subscribe(cursos => {

      this.cursos = cursos;
      for (let i in this.cursos) {
        this.cursos[i].currentIndex = 0;
        this.cursos[i].mostrar = this.cursos[i].contenido_interactivo.slice(0, 3);
      }
    });
  }


  getURLImageYoutube(url: string): string {
    return 'http://img.youtube.com/vi/ID/0.jpg'.replace('ID', url.match(this.URL_REGEXP)[7]);
  }

  siguiente(curso) {

    for (let i in this.cursos) {
      if (this.cursos[i].nombre === curso.textContent) {
        let tamaño = this.cursos[i].contenido_interactivo.length;
        console.log(tamaño);
        if (this.cursos[i].currentIndex < tamaño - 3) {
          this.cursos[i].currentIndex += 1;
          this.cursos[i].mostrar = this.cursos[i].contenido_interactivo.slice(this.cursos[i].currentIndex, this.cursos[i].currentIndex + 3);
          this.cursos[i].currentIndex
        }
      }
    }
  }
  anterior(curso) {
    for (let i in this.cursos) {
      if (this.cursos[i].nombre === curso.textContent) {
        if (this.cursos[i].currentIndex) {
          this.cursos[i].currentIndex -= 1;
          this.cursos[i].mostrar = this.cursos[i].contenido_interactivo.slice(this.cursos[i].currentIndex, this.cursos[i].currentIndex + 3);
        }
      }
    }
  }
}
