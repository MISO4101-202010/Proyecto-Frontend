import { TestBed } from '@angular/core/testing';

import { ProfesorService } from './profesor.service';

describe('ProfesorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfesorService = TestBed.get(ProfesorService);
    expect(service).toBeTruthy();
  });
});
