import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {FormFieldTagsComponent} from './form-field-tags.component'

describe('FormFieldTagsComponent', () => {
  let component: FormFieldTagsComponent
  let fixture: ComponentFixture<FormFieldTagsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldTagsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldTagsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
