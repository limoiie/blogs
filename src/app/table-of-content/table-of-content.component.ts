import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {MainScrollService} from '../main-scroll.service';

interface LinkSection {
  name: string;
  links: Link[];
}

interface Link {
  /* id of the section*/
  id: string;

  /* header type h3/h4 */
  type: string;

  /* If the anchor is in view of the page */
  active: boolean;

  /* name of the anchor */
  name: string;

  /* top offset px of the anchor */
  top: number;
}


@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.sass']
})
export class TableOfContentComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private element: ElementRef,
              private scrollService: MainScrollService,
              @Inject(DOCUMENT) private document: Document) {

    this.router.events.pipe(takeUntil(this.destroyed)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rootUrl = router.url.split('#')[0];
        if (rootUrl !== this.rootUrl) {
          this.rootUrl = rootUrl;
        }
      }
    });

    this.route.fragment.pipe(takeUntil(this.destroyed)).subscribe(fragment => {
      this.urlFragment = fragment;

      const target = document.getElementById(this.urlFragment);
      if (target) {
        target.scrollIntoView();
      }
    });
  }
  linkSections: LinkSection[] = [];
  links: Link[] = [];

  rootUrl = this.router.url.split('#')[0];
  private destroyed = new Subject();
  private urlFragment = '';

  private static isLinkActive(scrollOffset, currentLink: any, nextLink: any): boolean {
    // A link is considered active if the page is scrolled passed the anchor without also
    // being scrolled passed the next link
    return scrollOffset >= currentLink.top && !(nextLink && nextLink.top < scrollOffset);
  }

  ngOnInit(): void {
    // On init, the sidenav content element doesn't yet exist, so it's not possible
    // to subscribe to its scroll event until next tick (when it does exist).
    Promise.resolve().then(() => {
      this.scrollService.scrolled$
        .pipe(takeUntil(this.destroyed))
        .subscribe(ev => this.onScroll(ev));
    });
  }

  ngAfterViewInit() {
    this.updateScrollPosition();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  updateScrollPosition(): void {
    const target = document.getElementById(this.urlFragment);
    if (target) {
      target.scrollIntoView();
    }
  }

  resetHeaders() {
    this.linkSections = [];
    this.links = [];
  }

  addHeaders(sectionName: string, docViewerContent: HTMLElement) {
    const headers = Array.from<HTMLHeadingElement>(docViewerContent.querySelectorAll('h2, h3'));
    const links: Link[] = [];
    headers.forEach((header) => {
      // remove the 'link' icon name from the inner text
      const name = header.innerText.trim().replace(/^link/, '');
      const {top} = header.getBoundingClientRect();
      links.push({
        name,
        type: header.tagName.toLowerCase(),
        top,
        id: header.id,
        active: false
      });
    });
    this.linkSections.push({name: sectionName, links});
    this.links.push(...links);
  }

  /** Gets the scroll offset of the scroll container */
  private getScrollOffset(scrollContainer): number | void {
    const {top} = this.element.nativeElement.getBoundingClientRect();
    if (typeof scrollContainer.scrollTop !== 'undefined') {
      return scrollContainer.scrollTop + top;
    } else if (typeof scrollContainer.pageYOffset !== 'undefined') {
      return scrollContainer.pageYOffset + top;
    }
  }

  /** Update active states */
  private onScroll(ev): void {
    console.log('target top: ', ev.scrollTop);
    const offset = this.getScrollOffset(ev);
    console.log('offset: ', offset);
    console.log('link ', this.links[0].top);
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].active = TableOfContentComponent.isLinkActive(offset,
        this.links[i], this.links[i + 1]);
    }
  }

}
