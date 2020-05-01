import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ContenidoService } from 'src/app/services/contenido.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-curso-profesor',
  templateUrl: './curso-profesor.component.html',
  styleUrls: ['./curso-profesor.component.css']
})
export class CursoProfesorComponent implements OnInit {

  URL_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  interactive_contents;
  show;
  currentIndex;
  courseName: string;
  constructor(private contenidoService: ContenidoService, config: NgbCarouselConfig, private activatedRoute: ActivatedRoute) {
    config.interval = 4000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.activatedRoute.params.subscribe ( params => {
      if (params.id) {
        this.contenidoService.getCursosIdList(params.id).subscribe(interactive_contents =>
        {
          this.interactive_contents = interactive_contents;
          if(Object.keys(interactive_contents).length !== 0)
          {
            this.courseName = this.interactive_contents[0].cursos.find(course => { return course.id == params.id }).nombre;
            for (let i in this.interactive_contents) {
              this.interactive_contents.currentIndex=0;
              this.show = this.interactive_contents.slice(0, 3);
            }
          }
        });
      }
    });
  }

  getURLImageYoutube(url: string): string {
    return 'http://img.youtube.com/vi/ID/0.jpg'.replace('ID', url.match(this.URL_REGEXP)[7]);
  }

  next() {
    let tam = this.interactive_contents.length;

    if (this.interactive_contents.currentIndex < tam - 3) {
      this.interactive_contents.currentIndex += 1;
      this.show = this.interactive_contents.slice(this.interactive_contents.currentIndex, this.interactive_contents.currentIndex + 3);
    }
  }

  previous() {
    let tam = this.interactive_contents.length;

    if (this.interactive_contents.currentIndex > 0) {
      this.interactive_contents.currentIndex -= 1;
      this.show = this.interactive_contents.slice(this.interactive_contents.currentIndex, this.interactive_contents.currentIndex + 3);
    }
  }
}
