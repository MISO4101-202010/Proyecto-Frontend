import { TestBed } from '@angular/core/testing';

import { ContenidoService } from './contenido.service';

describe('ContenidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContenidoService = TestBed.get(ContenidoService);
    expect(service).toBeTruthy();
  });
});
