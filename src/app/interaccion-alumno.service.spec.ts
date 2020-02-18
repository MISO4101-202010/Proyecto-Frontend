import { TestBed } from '@angular/core/testing';

import { InteraccionAlumnoService } from './interaccion-alumno.service';

describe('InteraccionAlumnoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InteraccionAlumnoService = TestBed.get(InteraccionAlumnoService);
    expect(service).toBeTruthy();
  });
});
