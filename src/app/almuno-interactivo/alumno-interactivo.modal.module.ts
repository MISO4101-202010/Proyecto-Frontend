import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmunoInteractivoComponent } from './almuno-interactivo.component';
import { Routes, RouterModule } from '@angular/router';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {MatIconModule} from '@angular/material';

const routes: Routes = [
  { path: '', component: AlmunoInteractivoComponent },
];

@NgModule({
  declarations: [AlmunoInteractivoComponent],
  imports: [
    NgbModule,
    YoutubePlayerModule,
    CommonModule,
    HttpModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
  entryComponents: []
})
export class AlumnoInteractivoModule { }
