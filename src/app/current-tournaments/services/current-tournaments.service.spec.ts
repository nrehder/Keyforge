import { TestBed } from '@angular/core/testing';

import { CurrentTournamentsService } from './current-tournaments.service';

describe('CurrentTournamentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentTournamentsService = TestBed.get(CurrentTournamentsService);
    expect(service).toBeTruthy();
  });
});
