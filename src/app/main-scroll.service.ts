import {HostListener, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, map, pairwise, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainScrollService {

  private scrolled = new Subject();
  private readonly diffScrolled;

  constructor() {
    this.diffScrolled = this.scrolled
      .pipe(
        map((ele: any) => [ele, ele.scrollTop]),
        debounceTime(10), pairwise(),
        map((pair: any) => {
          const [[, prevTop], [currEle, currTop]] = pair;
          return [currEle, currTop - prevTop];
        })
      );
  }

  get diffScrolled$() {
    return this.diffScrolled;
  }

  get scrolled$() {
    return this.scrolled.asObservable();
  }

  onScroll($event) {
    // console.log('scroll element: ', $event.target.scrollingElement);
    this.scrolled.next($event.target.scrollingElement);
  }

}
