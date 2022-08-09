import {animate, style, transition, trigger} from '@angular/animations'
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output
} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {CookieService} from 'ngx-cookie-service'
import {BehaviorSubject, Observable} from 'rxjs'
import {delay, filter, take} from 'rxjs/operators'
import {ScrollOut} from '../directives/scroll-out.directive'
import {LoginComponent} from '../login/login.component'
import {AuthService} from '../services/auth.service'
import {ProgressBarService} from '../services/progress-bar.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  animations: [
    trigger('navbarInOutTrigger', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-out', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class NavbarComponent extends ScrollOut implements OnInit {
  isDarkMode = false
  activeThemeIdx = 0
  themes: string[] = [
    'Deep Purple & Amber',
    'Indigo & Pink',
    'Pink & Blue-grey',
    'Purple & Green'
  ]

  @Input() isHandset$!: Observable<boolean>
  @Output() menuClicked = new EventEmitter()

  private themeChanged = new BehaviorSubject<[boolean, number]>([false, 0])
  themeChanged$ = this.themeChanged.asObservable()

  constructor(
    private authService: AuthService,
    public progressBarService: ProgressBarService,
    private cookieService: CookieService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    super()
  }

  get hasLoggedIn(): boolean {
    return this.authService.hasLoggedIn
  }

  private static loadPrismTheme(bundleStyleName: string) {
    const prismThemeId = 'prism-theme'
    const themeLink = document.getElementById(prismThemeId) as HTMLLinkElement
    if (themeLink) {
      themeLink.href = bundleStyleName
    } else {
      const themeLink = document.createElement('link')
      themeLink.id = prismThemeId
      themeLink.rel = 'stylesheet'
      themeLink.href = `${bundleStyleName}`

      const head = document.getElementsByTagName('head')[0]
      head.appendChild(themeLink)
    }
  }

  ngOnInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.loadStateFromCookie()
      this.syncPrismTheme()
    })
  }

  onMenuClicked() {
    this.menuClicked.emit()
  }

  login() {
    this.matDialog
      .open(LoginComponent)
      .afterClosed()
      .pipe(filter((res) => res))
  }

  logout() {
    this.authService.logout()
  }

  onThemeChanged() {
    this.dumpStateToCookie()
    this.themeChanged.next([this.isDarkMode, this.activeThemeIdx])
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode
    this.ngZone.onStable.pipe(take(1), delay(200)).subscribe(() => {
      this.syncPrismTheme()
    })

    this.dumpStateToCookie()
    this.themeChanged.next([this.isDarkMode, this.activeThemeIdx])
  }

  private syncPrismTheme() {
    NavbarComponent.loadPrismTheme(
      !this.isDarkMode
        ? 'assets/prism-theme/prism-one-light.css'
        : 'assets/prism-theme/prism-one-dark.css'
    )
  }

  private dumpStateToCookie() {
    this.cookieService.set('dark-mode', String(this.isDarkMode))
    this.cookieService.set('theme-index', String(this.activeThemeIdx))
  }

  private loadStateFromCookie() {
    this.isDarkMode = this.cookieService.get('dark-mode') == 'true'
    this.activeThemeIdx = Number(this.cookieService.get('theme-index') || 0)

    this.themeChanged.next([this.isDarkMode, this.activeThemeIdx])
  }
}
