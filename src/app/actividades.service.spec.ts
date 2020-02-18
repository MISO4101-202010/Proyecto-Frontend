import { TestBed } from '@angular/core/testing';

import { ActividadesService } from './actividades.service';

describe('ActividadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActividadesService = TestBed.get(ActividadesService);
    expect(service).toBeTruthy();
  });
});
