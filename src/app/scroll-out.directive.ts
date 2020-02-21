import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, filter, map, pairwise, takeUntil, tap} from 'rxjs/operators';
import { RtlScrollAxisType } from '@angular/cdk/platform';

// The target element should extends this base class
export class ScrollOut {
  isShown = true;
}

// Check if meet a reach
class ReachedFunctions {
  static reachedTop(offset: number, e: any): boolean {
    return ReachedFunctions.reached(-e.target.scrollTop, 0, offset);
  }

  static reachedBottom(offset: number, e: any): boolean {
    return ReachedFunctions.reached(e.target.scrollTop + e.target.clientHeight, e.target.scrollHeight, offset);
  }

  static reachedStart(offset: number, e: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(e.target.scrollLeft, 0, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
      }
      return ReachedFunctions.reached(e.target.scrollLeft + e.target.clientWidth, e.target.scrollWidth, offset);
    }
    return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
  }

  static reachedEnd(offset: number, e: any, direction: 'ltr' | 'rtl', rtlScrollAxisType: RtlScrollAxisType): boolean {
    if (direction === 'rtl') {
      if (rtlScrollAxisType === RtlScrollAxisType.NEGATED) {
        return ReachedFunctions.reached(-(e.target.scrollLeft - e.target.clientWidth), e.target.scrollWidth, offset);
      }
      if (rtlScrollAxisType === RtlScrollAxisType.INVERTED) {
        return ReachedFunctions.reached(-(e.target.scrollLeft + e.target.clientWidth), e.target.scrollWidth, offset);
      }
      return ReachedFunctions.reached(-e.target.scrollLeft, 0, offset);
    }
    return ReachedFunctions.reached(e.target.scrollLeft + e.target.clientWidth, e.target.scrollWidth, offset);
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

  @Input() scrollEvOb$;
  @Input() host;
  @Input() resolution = 10;
  @Input() topShow = true;
  @Input() botShow = true;
  constructor() {
  }

  // create a common scroll event observer
  public static createScrollEventObserver(scrollEvent) {
    const packEv = ev => [ev, ev.target.scrollTop];
    const packPair = evs => [evs[1][0], evs[1][1] - evs[0][1]];

    return scrollEvent.pipe(
      debounceTime(10),
      map(packEv),
      pairwise(),
      map(packPair)
    );
  }

  ngOnInit(): void {
    console.assert(this.host.isShown !== undefined,
      'You should extend ScrollOut for the directed component!');

    this.scrollEvOb$
      .pipe(takeUntil(this.destroy$))
      .subscribe(obs => {
        obs
          .pipe(takeUntil(this.destroy$))
          .subscribe(
          evInterval => {
            const ev = evInterval[0];
            const interval = evInterval[1];

            // interval is big enough
            if (Math.abs(interval) > this.resolution) {
              if (interval > 0 === this.host.isShown) {
                this.host.isShown = !this.host.isShown;
              }
            }

            if (ReachedFunctions.reachedTop(0, ev)) {
              this.host.isShown = this.topShow;
            }
            if (ReachedFunctions.reachedBottom(0, ev)) {
              this.host.isShown = this.botShow;
            }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
