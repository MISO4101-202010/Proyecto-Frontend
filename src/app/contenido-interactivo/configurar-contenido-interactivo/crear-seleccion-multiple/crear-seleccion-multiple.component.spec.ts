import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSeleccionMultipleComponent } from './crear-seleccion-multiple.component';

describe('CrearSeleccionMultipleComponent', () => {
  let component: CrearSeleccionMultipleComponent;
  let fixture: ComponentFixture<CrearSeleccionMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearSeleccionMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSeleccionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
