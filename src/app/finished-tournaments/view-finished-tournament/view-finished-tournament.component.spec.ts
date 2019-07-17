import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFinishedTournamentComponent } from './view-finished-tournament.component';

describe('ViewFinishedTournamentComponent', () => {
  let component: ViewFinishedTournamentComponent;
  let fixture: ComponentFixture<ViewFinishedTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFinishedTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFinishedTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
