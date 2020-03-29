import { Component, OnInit } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-contenido-interactivo',
  templateUrl: './detalle-contenido-interactivo.component.html',
  styleUrls: ['./detalle-contenido-interactivo.component.css']
})
export class DetalleContenidoInteractivoComponent implements OnInit {

  secondData;
  id: number;

  constructor(private contenidoService: ContenidoService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.contenidoService.getDetalleContenidoInteractivo(+params.id).subscribe(data => {
          console.log(data);
          this.secondData = data;
        });
      }
    });
  }

  goToConfiguration(id) {
    window.location.href = '#/contenido-interactivo/configurar/' + id;
  }

}
