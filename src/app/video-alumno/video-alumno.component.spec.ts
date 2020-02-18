import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAlumnoComponent } from './video-alumno.component';

describe('VideoAlumnoComponent', () => {
  let component: VideoAlumnoComponent;
  let fixture: ComponentFixture<VideoAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
