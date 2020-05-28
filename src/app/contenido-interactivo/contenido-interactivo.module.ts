import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ListaContenidoComponent } from './lista-contenido/lista-contenido.component';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/material.module';
import { AddContenidoACursoComponent } from './add-contenido-a-curso/add-contenido-a-curso.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReporteContenidoComponent } from './reporte-contenido/reporte-contenido.component';
import { MarkersComponent } from './markers/markers.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { ManyAnswersComponent } from './many-answers/many-answers.component';
import { ConfigurarContenidoInteractivoComponent } from './configurar-contenido-interactivo/configurar-contenido-interactivo.component';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { CrearSeleccionMultipleComponent } from './configurar-contenido-interactivo/crear-seleccion-multiple/crear-seleccion-multiple.component';
import { CrearPreguntaAbiertaComponent } from './configurar-contenido-interactivo/crear-pregunta-abierta/crear-pregunta-abierta.component';
import { CrearPreguntaVerdaderoFalsoComponent } from './configurar-contenido-interactivo/crear-pregunta-verdadero-falso/crear-pregunta-verdadero-falso.component';
import { DetalleContenidoInteractivoComponent } from './detalle-contenido-interactivo/detalle-contenido-interactivo.component';
import { CrearPreguntaPausaComponent } from './configurar-contenido-interactivo/crear-pregunta-pausa/crear-pregunta-pausa.component';
import { RevisionContentComponent } from './revision-content/revision-content.component';
import { CalificacionContenidoInteractivoComponent } from "./calificacion-contenido-interactivo/calificacion-contenido-interactivo.component";
import { ValidationService } from '../services/validation.service';
import { AuthGuard } from '../helpers/auth.guard';

const routes: Routes = [
  { path: '', component: ListaContenidoComponent, canActivate:[AuthGuard] },
  { path: 'reporte/:id', component: ReporteContenidoComponent, canActivate:[AuthGuard] },
  { path: 'manejar', component: MarkersComponent , canActivate:[AuthGuard]},
  { path: 'configurar/:id', component: ConfigurarContenidoInteractivoComponent, canActivate:[AuthGuard]},
  { path: 'detalle/:id', component: DetalleContenidoInteractivoComponent},
  { path: 'revision/:id', component: RevisionContentComponent},
  { path: 'calificacion/:idContenidoInteractivo', component: CalificacionContenidoInteractivoComponent},
];

@NgModule({
  declarations: [ListaContenidoComponent, AddContenidoACursoComponent, ReporteContenidoComponent,
    MarkersComponent, ManyAnswersComponent, DetalleContenidoInteractivoComponent,
    ConfigurarContenidoInteractivoComponent, CrearSeleccionMultipleComponent,
    CrearPreguntaAbiertaComponent, CrearPreguntaVerdaderoFalsoComponent,
    CrearPreguntaPausaComponent, RevisionContentComponent,
    CalificacionContenidoInteractivoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    RichTextEditorAllModule,
    FormsModule,
    MatDialogModule,
    YoutubePlayerModule,
    DragDropModule
  ],
  exports: [RouterModule],
  entryComponents: [
    AddContenidoACursoComponent,
    CrearSeleccionMultipleComponent,
    CrearPreguntaAbiertaComponent,
    CrearPreguntaVerdaderoFalsoComponent,
    CrearPreguntaPausaComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    ValidationService
  ]
})
export class ContenidoInteractivoModule { }
