import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core'
import {MatSidenavContent} from '@angular/material/sidenav'
import {MarkdownService} from 'ngx-markdown'
import {Subject} from 'rxjs'
import {map, shareReplay} from 'rxjs/operators'
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component'
import {fixMarkdownService} from './markdown-render-custom'
import {NavbarComponent} from './navbar/navbar.component'
import {AuthService} from './services/auth.service'
import {MainScrollService} from './services/main-scroll.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: []
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild(GotoTopBtnComponent)
    gotoTopBtn!: GotoTopBtnComponent

  @ViewChild(NavbarComponent)
    navbar!: NavbarComponent

  @ViewChild(MatSidenavContent)
    matSidenavContent!: MatSidenavContent

  title = 'blogs'

  destroy$ = new Subject()

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  )

  constructor(
    private breakpointObserver: BreakpointObserver,
    private scrollService: MainScrollService,
    private markdownService: MarkdownService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platform: object
  ) {
    fixMarkdownService(markdownService)
  }

  ngAfterViewInit(): void {
    this.fulfillScreen(null)
  }

  ngOnDestroy(): void {
    this.destroy$.complete()
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: any) {
    this.scrollService.onScroll($event)
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any) {
    this.fulfillScreen($event)
  }

  private fulfillScreen($event: any) {
    const height = $event ? $event.target.innerHeight : window.innerHeight
    this.matSidenavContent.getElementRef().nativeElement.style.minHeight =
      height + 'px'
  }
}
