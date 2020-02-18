import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbdModal1Content, NgbdModal2Content, NgbdModalContent, VideoModalComponent, NgbdModal3Content} from './video-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {MatIconModule} from '@angular/material';

const routes: Routes = [
  { path: '', component: VideoModalComponent },
];

@NgModule({
  declarations: [VideoModalComponent, NgbdModalContent, NgbdModal1Content, NgbdModal2Content, NgbdModal3Content],
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
  exports: [RouterModule, VideoModalComponent, MatIconModule, MaterialModule],
  entryComponents: [NgbdModalContent, NgbdModal1Content, NgbdModal2Content, NgbdModal3Content]
})
export class VideoModalModule { }
