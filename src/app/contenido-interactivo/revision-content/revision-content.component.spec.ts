import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionContentComponent } from './Revision-content.component';

describe('RevisionContentComponent', () => {
  let component: RevisionContentComponent;
  let fixture: ComponentFixture<RevisionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
