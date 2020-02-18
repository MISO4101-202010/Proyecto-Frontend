import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarContenidoInteractivoComponent } from './configurar-contenido-interactivo.component';

describe('ConfigurarContenidoInteractivoComponent', () => {
  let component: ConfigurarContenidoInteractivoComponent;
  let fixture: ComponentFixture<ConfigurarContenidoInteractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarContenidoInteractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarContenidoInteractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
