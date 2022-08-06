import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core'

@Directive({
  selector: '[appWindowHeightTracking]'
})
export class WindowHeightTrackingDirective implements OnInit {
  @Input() heightDiff = '0'

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.onResize()
  }

  @HostListener('window:resize', [])
  onResize() {
    this.el.nativeElement.style.height =
      window.innerHeight + parseFloat(this.heightDiff) + 'px'
  }
}
