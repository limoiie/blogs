import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core'

@Directive({
  selector: '[appMaterialElevation]'
})
export class MaterialElevationDirective implements OnChanges {
  @Input() defaultElevation = 2
  @Input() raisedElevation = 8

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.setElevation(this.defaultElevation)
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.setElevation(this.defaultElevation)
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setElevation(this.raisedElevation)
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setElevation(this.defaultElevation)
  }

  setElevation(amount: number) {
    // remove all elevation classes
    const classList = (this.element.nativeElement as HTMLElement).classList
    const classesToRemove = Array.from(classList).filter((c) =>
      c.startsWith('mat-elevation-z')
    )
    classesToRemove.forEach((c) => {
      this.renderer.removeClass(this.element.nativeElement, c)
    })

    if (amount > 0) {
      // add the given elevation class
      const newClass = `mat-elevation-z${amount}`
      this.renderer.addClass(this.element.nativeElement, newClass)
    }
  }
}
