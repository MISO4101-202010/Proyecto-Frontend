import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkersComponent } from './markers.component';

describe('MarkersComponent', () => {
  let component: MarkersComponent;
  let fixture: ComponentFixture<MarkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
