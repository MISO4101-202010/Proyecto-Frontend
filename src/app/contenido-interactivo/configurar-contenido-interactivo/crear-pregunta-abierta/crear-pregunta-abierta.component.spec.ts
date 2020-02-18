import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPreguntaAbiertaComponent } from './crear-pregunta-abierta.component';

describe('CrearPreguntaAbiertaComponent', () => {
  let component: CrearPreguntaAbiertaComponent;
  let fixture: ComponentFixture<CrearPreguntaAbiertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPreguntaAbiertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPreguntaAbiertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
