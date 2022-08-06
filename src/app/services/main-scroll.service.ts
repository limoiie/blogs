import {Injectable} from '@angular/core'
import {EMPTY, mergeMap, Observable, of, Subject} from 'rxjs'
import {debounceTime, map, pairwise} from 'rxjs/operators'
import {ConcreteEvent} from '../utils/concrete-event'

@Injectable({
  providedIn: 'root'
})
export class MainScrollService {
  private scrolled = new Subject<ConcreteEvent<Document>>()
  private readonly diffScrolled: Observable<[Element, number]>
  private readonly pureScrolled: Observable<[Element, number]>

  constructor() {
    this.pureScrolled = this.scrolled.pipe(
      map(event => event.target.scrollingElement),
      mergeMap(ele => (ele !== null) ? of(ele) : EMPTY),
      map((ele: Element) => [ele, ele.scrollTop])
    )

    this.diffScrolled = this.pureScrolled.pipe(
      debounceTime(10),
      pairwise(),
      map((pair: [[Element, number], [Element, number]]) => {
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

  onScroll($event: ConcreteEvent<Document>) {
    this.scrolled.next($event)
  }
}
