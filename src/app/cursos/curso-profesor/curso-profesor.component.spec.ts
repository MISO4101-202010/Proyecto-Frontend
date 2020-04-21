import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoProfesorComponent } from './curso-profesor.component';

describe('CursoProfesorComponent', () => {
  let component: CursoProfesorComponent;
  let fixture: ComponentFixture<CursoProfesorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursoProfesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
