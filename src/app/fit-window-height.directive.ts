import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appFitWindowHeight]'
})
export class FitWindowHeightDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.el.nativeElement.style.height = window.innerHeight + 'px';
    console.log('window resize ' + window.innerHeight);
    console.log('element height ' + this.el.nativeElement.style.height);
  }

}
