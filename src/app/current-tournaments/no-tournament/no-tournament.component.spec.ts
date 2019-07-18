import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTournamentComponent } from './no-tournament.component';

describe('NoTournamentComponent', () => {
  let component: NoTournamentComponent;
  let fixture: ComponentFixture<NoTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
