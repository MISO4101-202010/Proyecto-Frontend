import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteContenidoComponent } from './reporte-contenido.component';

describe('ReporteContenidoComponent', () => {
  let component: ReporteContenidoComponent;
  let fixture: ComponentFixture<ReporteContenidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteContenidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
