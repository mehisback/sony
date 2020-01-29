import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCheckListComponent } from './status-check-list.component';

describe('StatusCheckListComponent', () => {
  let component: StatusCheckListComponent;
  let fixture: ComponentFixture<StatusCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
