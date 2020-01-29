import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedGrListComponent } from './posted-gr-list.component';

describe('PostedGrListComponent', () => {
  let component: PostedGrListComponent;
  let fixture: ComponentFixture<PostedGrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedGrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedGrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
