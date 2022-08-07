import {DOCUMENT} from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core'
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router'
import {EMPTY, from, mergeMap, of, reduce, Subject} from 'rxjs'
import {map, pairwise, takeUntil} from 'rxjs/operators'
import {MainScrollService} from '../services/main-scroll.service'
import {Link} from '../table-of-content-link/link'
import {TreeNode} from '../utils/tree-node'

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.sass']
})
export class TableOfContentComponent implements OnInit, AfterViewInit, OnDestroy {
  toc: TreeNode<Link> | null = null

  private destroyed$ = new Subject()
  private rootUrl = this.router.url.split('#')[0]
  private urlFragment = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private element: ElementRef,
    private scrollService: MainScrollService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rootUrl = router.url.split('#')[0]
        if (rootUrl !== this.rootUrl) {
          this.rootUrl = rootUrl
        }
      }
    })

    this.route.fragment
      .pipe(takeUntil(this.destroyed$))
      .subscribe((fragment) => {
        this.urlFragment = fragment || ''
        this.updateScrollPosition()
      })
  }

  ngOnInit(): void {
    // On init, the sidenav content element doesn't yet exist, so it's not possible
    // to subscribe to its scroll event until next tick (when it does exist).
    Promise.resolve().then(() => {
      this.scrollService.scrolled$
        .pipe(
          takeUntil(this.destroyed$),
          map(event => event.target.scrollingElement),
          mergeMap(elem => elem !== null ? of(elem) : EMPTY)
        )
        .subscribe(elem => this.onScroll(elem))
    })
  }

  ngAfterViewInit() {
    this.updateScrollPosition()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null)
    this.destroyed$.complete()
  }

  appendSectionTOC(sectionName: string, docViewerContent: HTMLElement) {
    this.toc = this.buildTOC(docViewerContent)
  }

  private updateScrollPosition(): void {
    document.getElementById(this.urlFragment)?.scrollIntoView()
  }

  private buildTOC(docViewerContent: HTMLElement): TreeNode<Link> {
    let root: TreeNode<Link>
    from(docViewerContent.querySelectorAll('h1, h2, h3')).pipe(
      map(header => header as HTMLHeadingElement),
      map(header => {
        const name = header.innerText.trim().replace(/^link/, '')
        const {top} = header.getBoundingClientRect()
        return new TreeNode<Link>({
          name,
          level: +header.tagName.substring(1),
          type: header.tagName.toLowerCase(),
          top,
          id: header.id,
          active: false,
          expanded: false
        })
      }),
      reduce((acc, next,) => {
        let parent: TreeNode<Link> | null = acc
        while (parent && parent.data.level >= next.data.level) {
          parent = parent.parent
        }
        parent?.appendChild(next)
        return next
      })
    ).subscribe(node => {
      while (node.parent) {
        node = node.parent
      }
      root = node
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return root!
  }

  /** Update active states */
  private onScroll(elem: Element) {
    if (!this.toc) {
      return
    }

    const maxTop = Number.MAX_SAFE_INTEGER
    const pageTop = this.toc.data.top + getScrollOffset(elem) - 40

    from(this.toc.toStream_()).pipe(
      pairwise()
    ).subscribe(([curr, next]) => {
      //todo: expand only active link sections
      // eslint-disable-next-line
      curr!.active = curr!.top <= pageTop && pageTop < (next?.top || maxTop)
    })
  }
}

/** Gets the scroll offset of the scroll container */
function getScrollOffset(scrollContainer: {scrollTop?: number, pageYOffset?: number}): number {
  if (typeof scrollContainer.scrollTop !== 'undefined') {
    return scrollContainer.scrollTop
  } else if (typeof scrollContainer.pageYOffset !== 'undefined') {
    return scrollContainer.pageYOffset
  }
  return 0
}
