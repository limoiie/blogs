import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {fromEvent, Subject} from 'rxjs';
import {GotoTopBtnComponent} from './goto-top-btn/goto-top-btn.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MainScrollService} from './main-scroll.service';

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
    private scrollService: MainScrollService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    this.scrollService.onScroll($event);
  }

}
