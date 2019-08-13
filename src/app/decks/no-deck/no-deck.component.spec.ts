import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDeckComponent } from './no-deck.component';

describe('NoDeckComponent', () => {
  let component: NoDeckComponent;
  let fixture: ComponentFixture<NoDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
