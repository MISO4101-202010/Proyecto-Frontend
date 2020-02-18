import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';


//Components of Pages
import { LoadVideoComponent } from './loadVideo/load-video.component';
import { CrearContenidoComponent, ModalAsociarContenidoInt } from './crear-contenido/crear-contenido.component';


const routes: Routes = [
  {path: '', component: LoadVideoComponent},
  {path: 'crearContenidoInt', component: CrearContenidoComponent},
];

@NgModule({
  declarations: [
  LoadVideoComponent,
  CrearContenidoComponent,
  ModalAsociarContenidoInt
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
