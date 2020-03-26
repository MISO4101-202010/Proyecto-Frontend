import {Component, OnInit} from '@angular/core';
import {CursoService} from '../../services/curso.service';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

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
      console.log('data', cursos);
      this.cursos = cursos;
    });
  }


  getURLImageYoutube(url: string): string {
    return 'http://img.youtube.com/vi/ID/0.jpg'.replace( 'ID', url.match(this.URL_REGEXP)[7]);
  }
}
