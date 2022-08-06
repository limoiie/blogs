import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {BlogPublishComponent} from './blog-publish.component'

describe('BlogUploadComponent', () => {
  let component: BlogPublishComponent
  let fixture: ComponentFixture<BlogPublishComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogPublishComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPublishComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
