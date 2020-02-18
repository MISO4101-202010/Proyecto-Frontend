import { TestBed } from '@angular/core/testing';

import { InterativeContentService } from './interative-content.service';

describe('InterativeContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterativeContentService = TestBed.get(InterativeContentService);
    expect(service).toBeTruthy();
  });
});
