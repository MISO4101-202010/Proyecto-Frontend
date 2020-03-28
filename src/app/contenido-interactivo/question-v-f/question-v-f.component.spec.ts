import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionVFComponent } from './question-v-f.component';

describe('QuestionVFComponent', () => {
  let component: QuestionVFComponent;
  let fixture: ComponentFixture<QuestionVFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionVFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionVFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
