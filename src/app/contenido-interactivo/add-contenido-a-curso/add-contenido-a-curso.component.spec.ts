import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContenidoACursoComponent } from './add-contenido-a-curso.component';

describe('AddContenidoACursoComponent', () => {
  let component: AddContenidoACursoComponent;
  let fixture: ComponentFixture<AddContenidoACursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContenidoACursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContenidoACursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
