import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPreguntaVerdaderoFalsoComponent } from './crear-pregunta-verdadero-falso.component';

describe('CrearPreguntaVerdaderoFalsoComponent', () => {
  let component: CrearPreguntaVerdaderoFalsoComponent;
  let fixture: ComponentFixture<CrearPreguntaVerdaderoFalsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPreguntaVerdaderoFalsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPreguntaVerdaderoFalsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
