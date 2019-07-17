import { TestBed } from '@angular/core/testing';

import { SingleElimService } from './single-elim.service';

describe('SingleElimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SingleElimService = TestBed.get(SingleElimService);
    expect(service).toBeTruthy();
  });
});
