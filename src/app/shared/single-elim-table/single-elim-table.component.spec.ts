import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleElimTableComponent } from './single-elim-table.component';

describe('SingleElimTableComponent', () => {
  let component: SingleElimTableComponent;
  let fixture: ComponentFixture<SingleElimTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleElimTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleElimTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
