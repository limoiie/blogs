import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TableOfContentLinkComponent } from './table-of-content-link.component'

describe('TableOfContentLinkComponent', () => {
  let component: TableOfContentLinkComponent
  let fixture: ComponentFixture<TableOfContentLinkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOfContentLinkComponent ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(TableOfContentLinkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
