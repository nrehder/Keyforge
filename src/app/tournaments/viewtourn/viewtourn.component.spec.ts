import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtournComponent } from './viewtourn.component';

describe('ViewtournComponent', () => {
  let component: ViewtournComponent;
  let fixture: ComponentFixture<ViewtournComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtournComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtournComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
