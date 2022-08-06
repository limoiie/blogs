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
import {Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'
import {MainScrollService} from '../services/main-scroll.service'

interface LinkSection {
  name: string
  links: Link[]
}

interface Link {
  /* id of the section*/
  id: string

  /* header type h3/h4 */
  type: string

  /* If the anchor is in view of the page */
  active: boolean

  /* name of the anchor */
  name: string

  /* top offset px of the anchor */
  top: number
}

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.sass']
})
export class TableOfContentComponent
implements OnInit, AfterViewInit, OnDestroy
{
  linkSections: LinkSection[] = []
  links: Link[] = []
  rootUrl = this.router.url.split('#')[0]
  private destroyed$ = new Subject()
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

        const target = document.getElementById(this.urlFragment)
        if (target) {
          target.scrollIntoView()
        }
      })
  }

  private static isLinkActive(
    scrollOffset: number,
    currentLink: any,
    nextLink: any
  ): boolean {
    // A link is considered active if the page is scrolled passed the anchor without also
    // being scrolled passed the next link
    return (
      scrollOffset >= currentLink.top &&
      !(nextLink && nextLink.top <= scrollOffset)
    )
  }

  /** Gets the scroll offset of the scroll container */
  private static getScrollOffset(scrollContainer: any): number {
    if (typeof scrollContainer.scrollTop !== 'undefined') {
      return scrollContainer.scrollTop
    } else if (typeof scrollContainer.pageYOffset !== 'undefined') {
      return scrollContainer.pageYOffset
    }
    return 0
  }

  ngOnInit(): void {
    // On init, the sidenav content element doesn't yet exist, so it's not possible
    // to subscribe to its scroll event until next tick (when it does exist).
    Promise.resolve().then(() => {
      this.scrollService.scrolled$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((elem) => this.onScroll(elem))
    })
  }

  ngAfterViewInit() {
    this.updateScrollPosition()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null)
  }

  updateScrollPosition(): void {
    const target = document.getElementById(this.urlFragment)
    if (target) {
      target.scrollIntoView()
    }
  }

  addHeaders(sectionName: string, docViewerContent: HTMLElement) {
    const links = this.extractHeaders(docViewerContent)
    this.linkSections.push({name: sectionName, links})
    this.links.push(...links)
  }

  private extractHeaders(docViewerContent: HTMLElement) {
    const links: Link[] = []
    const headers = Array.from<HTMLHeadingElement>(
      docViewerContent.querySelectorAll('h2, h3')
    )
    headers.forEach((header) => {
      // remove the 'link' icon name from the inner text
      const name = header.innerText.trim().replace(/^link/, '')
      const {top} = header.getBoundingClientRect()
      links.push({
        name,
        type: header.tagName.toLowerCase(),
        top,
        id: header.id,
        active: false
      })
    })
    return links
  }

  /** Update active states */
  private onScroll(elem: Element): void {
    if (this.links.length == 0) return
    const initOffset = this.links[0].top
    const offset =
      TableOfContentComponent.getScrollOffset(elem) + initOffset - 96
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].active = TableOfContentComponent.isLinkActive(
        offset,
        this.links[i],
        this.links[i + 1]
      )
    }
  }
}
