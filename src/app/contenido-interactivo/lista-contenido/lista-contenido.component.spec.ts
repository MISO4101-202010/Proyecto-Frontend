import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContenidoComponent } from './lista-contenido.component';

describe('ListaContenidoComponent', () => {
  let component: ListaContenidoComponent;
  let fixture: ComponentFixture<ListaContenidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaContenidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
