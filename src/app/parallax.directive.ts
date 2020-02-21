import {Directive, Input, ElementRef, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective implements AfterViewInit {
  initialTop = 0;

  @Input() ratio = 1;
  @Input() scrollbar;
  constructor(
    private eleRef: ElementRef
  ) {
    this.initialTop = this.eleRef.nativeElement
      .getBoundingClientRect().top;
  }

  ngAfterViewInit(): void {
    this.scrollbar.verticalScrolled.subscribe(
      ev => {
        this.eleRef.nativeElement.style.top =
          (this.initialTop - (ev.target.scrollTop * this.ratio)) + 'px';
      }
    );
  }

}
