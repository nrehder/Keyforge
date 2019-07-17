import { TestBed } from '@angular/core/testing';

import { RoundRobinService } from './round-robin.service';

describe('RoundRobinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoundRobinService = TestBed.get(RoundRobinService);
    expect(service).toBeTruthy();
  });
});
