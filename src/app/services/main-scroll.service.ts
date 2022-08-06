import {Injectable} from '@angular/core'
import {Observable, Subject} from 'rxjs'
import {debounceTime, map, pairwise} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MainScrollService {
  private scrolled = new Subject<Element>()
  private readonly diffScrolled: Observable<[Element, number]>
  private readonly pureScrolled: Observable<[Element, number]>

  constructor() {
    this.pureScrolled = this.scrolled.pipe(
      map((ele: Element) => [ele, ele.scrollTop])
    )

    this.diffScrolled = this.pureScrolled.pipe(
      debounceTime(10),
      pairwise(),
      map((pair: any) => {
        const [[, prevTop], [currEle, currTop]] = pair
        return [currEle, currTop - prevTop]
      })
    )
  }

  get pureScrolled$() {
    return this.pureScrolled
  }

  get diffScrolled$() {
    return this.diffScrolled
  }

  get scrolled$() {
    return this.scrolled.asObservable()
  }

  onScroll($event: any) {
    // console.log('scroll element: ', $event.target.scrollingElement)
    this.scrolled.next($event.target.scrollingElement)
  }
}
