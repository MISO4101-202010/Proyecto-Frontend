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
  mostrar;
  currentIndex;
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
          console.log('interactive_contents', interactive_contents);
          this.interactive_contents = interactive_contents;
          if(Object.keys(interactive_contents).length !== 0)
          {
            for (let i in this.interactive_contents) {
              this.interactive_contents.currentIndex=0;
              this.mostrar = this.interactive_contents.slice(0, 3);
              console.log('mostrar', this.interactive_contents.mostrar);
            }
          }
        });
      }
    });
  }

  getURLImageYoutube(url: string): string {
    return 'http://img.youtube.com/vi/ID/0.jpg'.replace('ID', url.match(this.URL_REGEXP)[7]);
  }

  siguiente() {
    let tam = this.interactive_contents.length;
    console.log(tam);
    if (this.interactive_contents.currentIndex < tam - 3) {
      this.interactive_contents.currentIndex += 1;
      this.interactive_contents.mostrar = this.interactive_contents.slice(this.interactive_contents.currentIndex, this.interactive_contents.currentIndex + 3);
    }
  }

  anterior() {
    let tam = this.interactive_contents.length;
    console.log(tam);
    if (this.interactive_contents.currentIndex < tam - 3) {
      this.interactive_contents.currentIndex -= 1;
      this.interactive_contents.mostrar = this.interactive_contents.slice(this.interactive_contents.currentIndex, this.interactive_contents.currentIndex + 3);
    }
  }
}
