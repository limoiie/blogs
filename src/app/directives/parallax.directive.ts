import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core'
import {NgScrollbar} from 'ngx-scrollbar'

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective implements AfterViewInit {
  initialTop = 0

  @Input() ratio = 1
  @Input() scrollbar!: NgScrollbar

  constructor(private eleRef: ElementRef) {
    this.initialTop = this.eleRef.nativeElement.getBoundingClientRect().top
  }

  ngAfterViewInit(): void {
    this.scrollbar.verticalScrolled.subscribe((ev: any) => {
      this.eleRef.nativeElement.style.top =
        this.initialTop - ev.target.scrollTop * this.ratio + 'px'
    })
  }
}
