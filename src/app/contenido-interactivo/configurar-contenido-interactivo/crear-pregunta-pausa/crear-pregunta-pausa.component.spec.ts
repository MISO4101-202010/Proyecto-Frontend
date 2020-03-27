import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrearPreguntaPausaComponent } from "./crear-pregunta-pausa.component";

describe("CrearPreguntaPausaComponent", () => {
  let component: CrearPreguntaPausaComponent;
  let fixture: ComponentFixture<CrearPreguntaPausaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrearPreguntaPausaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPreguntaPausaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
