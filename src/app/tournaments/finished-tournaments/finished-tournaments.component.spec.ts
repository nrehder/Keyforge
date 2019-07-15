import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedTournamentsComponent } from './finished-tournaments.component';

describe('FinishedTournamentsComponent', () => {
  let component: FinishedTournamentsComponent;
  let fixture: ComponentFixture<FinishedTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
