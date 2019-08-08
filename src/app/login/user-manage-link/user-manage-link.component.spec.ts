import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManageLinkComponent } from './user-manage-link.component';

describe('UserManageLinkComponent', () => {
  let component: UserManageLinkComponent;
  let fixture: ComponentFixture<UserManageLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManageLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
