import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrentTournamentComponent } from './view-current-tournament.component';

describe('ViewCurrentTournamentComponent', () => {
  let component: ViewCurrentTournamentComponent;
  let fixture: ComponentFixture<ViewCurrentTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCurrentTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrentTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
