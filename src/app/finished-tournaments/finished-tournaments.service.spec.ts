import { TestBed } from '@angular/core/testing';

import { FinishedTournamentsService } from './finished-tournaments.service';

describe('FinishedTournamentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinishedTournamentsService = TestBed.get(FinishedTournamentsService);
    expect(service).toBeTruthy();
  });
});
