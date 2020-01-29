import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatregisterComponent } from './vatregister.component';

describe('VatregisterComponent', () => {
  let component: VatregisterComponent;
  let fixture: ComponentFixture<VatregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
