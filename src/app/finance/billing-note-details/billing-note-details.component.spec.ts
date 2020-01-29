import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingNoteDetailsComponent } from './billing-note-details.component';

describe('BillingNoteDetailsComponent', () => {
  let component: BillingNoteDetailsComponent;
  let fixture: ComponentFixture<BillingNoteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingNoteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingNoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
