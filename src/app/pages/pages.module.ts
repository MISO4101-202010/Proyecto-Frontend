import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';


//Components of Pages
import { LoadVideoComponent } from './loadVideo/load-video.component';
import { CrearContenidoComponent, ModalAsociarContenidoInt } from './crear-contenido/crear-contenido.component';
import {ReporteComponent } from './reportes/reporte.component'


const routes: Routes = [
  {path: '', component: LoadVideoComponent},
  {path: 'crearContenidoInt', component: CrearContenidoComponent},
  {path: 'reportes', component: ReporteComponent},
];

@NgModule({
  declarations: [
  LoadVideoComponent,
  CrearContenidoComponent,
  ModalAsociarContenidoInt,
  ReporteComponent
  ],
  entryComponents: [ModalAsociarContenidoInt, LoadVideoComponent],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class PagesModule {
}
