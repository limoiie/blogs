import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GotoTopBtnComponent } from './goto-top-btn.component';

describe('GotoTopBtnComponent', () => {
  let component: GotoTopBtnComponent;
  let fixture: ComponentFixture<GotoTopBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GotoTopBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GotoTopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
