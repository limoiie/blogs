import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RtlScrollAxisType} from '@angular/cdk/platform';
import {MainScrollService} from '../services/main-scroll.service';

// The target element should extends this base class
export class ScrollOut {
  isShown = true;
}

// Check if meet a reach
class ReachedFunctions {
  static reachedTop(offset: number, target: any): boolean {
    return ReachedFunctions.reached(-target.scrollTop, 0, offset);
  }

  static reachedBottom(offset: number, target: any): boolean {
    return ReachedFunctions.reached(target.scrollTop + target.clientHeight, target.scrollHeight, offset);
  }

  // noinspection JSUnusedGlobalSymbols
  static reachedStart(offset: number, target: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(target.scrollLeft, 0, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-target.scrollLeft, 0, offset);
      }
      return ReachedFunctions.reached(target.scrollLeft + target.clientWidth, target.scrollWidth, offset);
    }
    return ReachedFunctions.reached(-target.scrollLeft, 0, offset);
  }

  // noinspection JSUnusedGlobalSymbols
  static reachedEnd(offset: number, target: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(-(target.scrollLeft - target.clientWidth), target.scrollWidth, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-(target.scrollLeft + target.clientWidth), target.scrollWidth, offset);
      }
      return ReachedFunctions.reached(-target.scrollLeft, 0, offset);
    }
    return ReachedFunctions.reached(target.scrollLeft + target.clientWidth, target.scrollWidth, offset);
  }

  static reached(currPosition: number, targetPosition: number, offset: number): boolean {
    return currPosition >= targetPosition - offset;
  }
}


// ScrollOutDirective listens to scroll event for controlling
// elementRef's visibility by setting the isShown field
@Directive({
  selector: '[appScrollOut]'
})
export class ScrollOutDirective implements OnInit, OnDestroy {

  destroy$ = new Subject();

  maxResolution = 100;
  @Input() scrolled$;
  @Input() host;
  @Input() resolution = 10;
  @Input() topShow = true;
  @Input() botShow = true;
  constructor(
    private scrollService: MainScrollService
  ) {
  }

  ngOnInit(): void {
    console.assert(this.host.isShown !== undefined,
      'You should extend ScrollOut for the directed component!');

    this.scrollService.diffScrolled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        eleDelta => {
          const ele = eleDelta[0];
          const delta = eleDelta[1];

          // interval is big enough
          if (Math.abs(delta) > this.resolution &&
            Math.abs(delta) < this.maxResolution) {
            if (delta > 0 === this.host.isShown) {
              this.host.isShown = !this.host.isShown;
            }
          }

          if (ReachedFunctions.reachedTop(0, ele)) {
            this.host.isShown = this.topShow;
          }
          if (ReachedFunctions.reachedBottom(0, ele)) {
            this.host.isShown = this.botShow;
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
