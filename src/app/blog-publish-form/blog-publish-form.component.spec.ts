import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {BlogPublishFormComponent} from './blog-publish-form.component'

describe('BlogPublishFormComponent', () => {
  let component: BlogPublishFormComponent
  let fixture: ComponentFixture<BlogPublishFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogPublishFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPublishFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
