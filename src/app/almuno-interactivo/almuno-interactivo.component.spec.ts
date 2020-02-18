import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmunoInteractivoComponent } from './almuno-interactivo.component';

describe('AlmunoInteractivoComponent', () => {
  let component: AlmunoInteractivoComponent;
  let fixture: ComponentFixture<AlmunoInteractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlmunoInteractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmunoInteractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
