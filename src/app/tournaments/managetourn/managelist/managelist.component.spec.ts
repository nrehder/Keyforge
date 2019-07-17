import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagelistComponent } from './managelist.component';

describe('ManagelistComponent', () => {
  let component: ManagelistComponent;
  let fixture: ComponentFixture<ManagelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
