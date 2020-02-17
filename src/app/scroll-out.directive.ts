import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {filter, map, pairwise} from 'rxjs/operators';

// The target element should extends this base class
export class ScrollOut {
  isShown = true;
}

// ScrollOutDirective listens to scroll event for controlling
// elementRef's visibility by setting the isShown field
@Directive({
  selector: '[appScrollOut]'
})
export class ScrollOutDirective implements OnInit, OnDestroy {

  subscription = Subscription.EMPTY;

  @Input() scrollEvOb$;
  @Input() host;
  @Input() resolution = 10;
  constructor() {
  }

  // create a common scroll event observer
  public static createScrollEventObserver(scrollbar) {
    return scrollbar.verticalScrolled.pipe(
      // get scroll offset to top
      map((ev: any) => ev.target.scrollTop),
      pairwise(),
      // compute the interval and map to [st, interval]
      map(pair => [pair[1], pair[1] - pair[0]]),
    );
  }

  ngOnInit(): void {
    console.assert(this.host.isShown !== undefined,
      'You should extend ScrollOut for the directed component!');

    this.scrollEvOb$.subscribe(obs => {
      this.subscription = obs.pipe(
        // filter out invisible interval
        filter(x => Math.abs(x[1]) > this.resolution)
      ).subscribe(
        ev => {
          if (ev[1] !== 0) {
            if (ev[1] > 0 === this.host.isShown) {
              this.host.isShown = !this.host.isShown;
            }
          }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
