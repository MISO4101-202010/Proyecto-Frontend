import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCursosComponent } from './estudiante-cursos.component';

describe('EstudianteCursosComponent', () => {
  let component: EstudianteCursosComponent;
  let fixture: ComponentFixture<EstudianteCursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudianteCursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
