import { TestBed } from '@angular/core/testing';

import { DeckRetrievalService } from './deck-retrieval.service';

describe('DeckRetrievalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeckRetrievalService = TestBed.get(DeckRetrievalService);
    expect(service).toBeTruthy();
  });
});
