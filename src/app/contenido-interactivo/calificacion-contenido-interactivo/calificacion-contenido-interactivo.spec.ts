import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionContenidoInteractivoComponent } from './calificacion-contenido-interactivo.component';

describe('RevisionContentComponent', () => {
  let component: CalificacionContenidoInteractivoComponent;
  let fixture: ComponentFixture<CalificacionContenidoInteractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificacionContenidoInteractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionContenidoInteractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
