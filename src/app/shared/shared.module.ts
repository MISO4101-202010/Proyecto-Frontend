import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

import { NavbarComponent } from './navbar/navbar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { MaterialModule } from '../../material.module';


@NgModule({
  imports: [
    MaterialModule,
    RouterModule,
    CommonModule,
    PipesModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  declarations: [
    NavbarComponent,
    NopagefoundComponent,
    NopagefoundComponent
  ],
  exports: [
    NopagefoundComponent,
    NavbarComponent,
    NopagefoundComponent
  ]
})
export class SharedModule { }
