import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManyAnswersComponent } from './many-answers.component';

describe('AnswersComponent', () => {
  let component: ManyAnswersComponent;
  let fixture: ComponentFixture<ManyAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManyAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManyAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
