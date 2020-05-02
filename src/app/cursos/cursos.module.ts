import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListaCursosComponent } from './lista-cursos/lista-cursos.component';
import { MaterialModule } from 'src/material.module';
import { EstudianteCursosComponent } from './estudiante-cursos/estudiante-cursos.component';
import { CursoProfesorComponent } from './curso-profesor/curso-profesor.component';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: ListaCursosComponent },
  { path: 'misCursos', component: EstudianteCursosComponent },
  { path: ':id', component: CursoProfesorComponent },
];

@NgModule({
  declarations: [ListaCursosComponent, EstudianteCursosComponent, CursoProfesorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    NgbCarouselModule
  ],
  exports: [RouterModule],
})
export class CursosModule { }
