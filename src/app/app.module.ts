import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modulos
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from '../material.module';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { ModalModule } from 'ngx-bootstrap/modal';


// Modulos
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { VideoModalModule } from './video-modal/video-modal.module';
import { VideoAlumnoModule } from './video-alumno/video-alumno.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {ToastrModule} from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestureConfig } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    YoutubePlayerModule,
    VideoModalModule,
    VideoAlumnoModule,
    ModalModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}} ,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
