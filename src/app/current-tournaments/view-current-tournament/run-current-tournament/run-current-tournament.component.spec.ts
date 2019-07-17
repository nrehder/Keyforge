import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCurrentTournamentComponent } from './run-current-tournament.component';

describe('RunCurrentTournamentComponent', () => {
  let component: RunCurrentTournamentComponent;
  let fixture: ComponentFixture<RunCurrentTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunCurrentTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunCurrentTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
