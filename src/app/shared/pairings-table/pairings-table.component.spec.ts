import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairingsTableComponent } from './pairings-table.component';

describe('PairingsTableComponent', () => {
  let component: PairingsTableComponent;
  let fixture: ComponentFixture<PairingsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairingsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
