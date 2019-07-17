import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFinishedTournamentComponent } from './full-finished-tournament.component';

describe('FullFinishedTournamentComponent', () => {
  let component: FullFinishedTournamentComponent;
  let fixture: ComponentFixture<FullFinishedTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullFinishedTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFinishedTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
