import { TestBed } from '@angular/core/testing';

import { SwissStyleService } from './swiss-style.service';

describe('SwissStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwissStyleService = TestBed.get(SwissStyleService);
    expect(service).toBeTruthy();
  });
});
