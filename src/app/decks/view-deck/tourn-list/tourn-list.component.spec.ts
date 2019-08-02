import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournListComponent } from './tourn-list.component';

describe('TournListComponent', () => {
  let component: TournListComponent;
  let fixture: ComponentFixture<TournListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
