import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTournamentsComponent } from './current-tournaments.component';

describe('CurrentTournamentsComponent', () => {
  let component: CurrentTournamentsComponent;
  let fixture: ComponentFixture<CurrentTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
