import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {NgScrollbar} from 'ngx-scrollbar';
import {ScrollOutDirective} from './scroll-out.directive';
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component';
import {NavbarComponent} from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: []
})
export class AppComponent implements AfterViewInit {

  @ViewChild(NgScrollbar)
  scrollbar;

  @ViewChild(GotoTopBtnComponent)
  gotoTopBtn;

  @ViewChild(NavbarComponent)
  navbar;

  title = 'blogs';
  scrollEventObserver$ = new Subject();

  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngAfterViewInit(): void {
    this.scrollEventObserver$.next(
      ScrollOutDirective.createScrollEventObserver(this.scrollbar)
    );
    this.scrollEventObserver$.complete();
  }

  onReachTop() {
    this.navbar.isShown = true;
    this.gotoTopBtn.isShown = false;
  }

  onReachBottom() {
    this.navbar.isShown = true;
    this.gotoTopBtn.isShown = true;
  }

}
