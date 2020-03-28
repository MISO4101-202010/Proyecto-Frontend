import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoAlumnoComponent} from './video-alumno.component';
import { Routes, RouterModule } from '@angular/router';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuestionModalComponent } from 'src/app/contenido-interactivo/question-modal/question-modal.component';
import {QuestionVFComponent} from '../contenido-interactivo/question-v-f/question-v-f.component';
import { MaterialModule } from 'src/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  { path: ':id', component: VideoAlumnoComponent },
];

@NgModule({
    declarations: [
      QuestionModalComponent,
      QuestionVFComponent,
      VideoAlumnoComponent],
  imports: [
    MaterialModule,
    NgbModule,
    YoutubePlayerModule,
    CommonModule,
    MatCheckboxModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
    entryComponents: [
      QuestionModalComponent,
      QuestionVFComponent
    ],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      { provide: MatCheckboxModule, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {}
      }
    ],
    exports: [RouterModule, VideoAlumnoComponent]
  })
  export class VideoAlumnoModule { }
