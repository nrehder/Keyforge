import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageviewComponent } from './manageview.component';

describe('ManageviewComponent', () => {
  let component: ManageviewComponent;
  let fixture: ComponentFixture<ManageviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
