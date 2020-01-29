import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedPickListComponent } from './posted-pick-list.component';

describe('PostedPickListComponent', () => {
  let component: PostedPickListComponent;
  let fixture: ComponentFixture<PostedPickListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedPickListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedPickListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
