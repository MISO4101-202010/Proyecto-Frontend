import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleContenidoInteractivoComponent } from './detalle-contenido-interactivo.component';

describe('DetalleContenidoInteractivoComponent', () => {
  let component: DetalleContenidoInteractivoComponent;
  let fixture: ComponentFixture<DetalleContenidoInteractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleContenidoInteractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleContenidoInteractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
