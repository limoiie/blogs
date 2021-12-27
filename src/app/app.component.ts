import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatSidenavContent} from "@angular/material/sidenav";
import {map, shareReplay} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MainScrollService} from './services/main-scroll.service';
import {MarkdownService} from 'ngx-markdown';
import {fixMarkdownService} from './markdown-render-custom';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: []
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(GotoTopBtnComponent)
  gotoTopBtn;

  @ViewChild(NavbarComponent)
  navbar;

  @ViewChild(MatSidenavContent)
  matSidenavContent: MatSidenavContent;

  title = 'blogs';

  destroy$ = new Subject();

  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private scrollService: MainScrollService,
    private markdownService: MarkdownService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platform: object
  ) {
    fixMarkdownService(markdownService);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.fulfillScreen(null)
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    this.scrollService.onScroll($event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fulfillScreen(event)
  }

  private fulfillScreen(event) {
    const height = event ? event.target.innerHeight : window.innerHeight
    this.matSidenavContent.getElementRef().nativeElement.style.minHeight = height + 'px'
  }

}
