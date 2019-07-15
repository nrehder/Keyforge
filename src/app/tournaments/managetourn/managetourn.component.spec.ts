import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagetournComponent } from './managetourn.component';

describe('ManagetournComponent', () => {
  let component: ManagetournComponent;
  let fixture: ComponentFixture<ManagetournComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagetournComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagetournComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
