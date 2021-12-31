import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {delay, take} from "rxjs/operators";
import {ScrollOut} from '../directives/scroll-out.directive';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {MatRadioChange} from '@angular/material/radio';
import {ProgressBarService} from '../services/progress-bar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  animations: [
    trigger('navbarInOutTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)'}),
        animate('200ms ease-out',
          style({ transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-out',
          style({ transform: 'translateY(-100%)' }))
      ])
    ]),
  ]
})
export class NavbarComponent extends ScrollOut implements OnInit {
  isDarkMode = false;
  isLogin = false;

  activeThemeIdx = 0;
  themes: string[] = [
    'Deep Purple & Amber',
    'Indigo & Pink',
    'Pink & Blue-grey',
    'Purple & Green'
  ];

  @Input() isHandset$: Observable<boolean>;
  @Output() menuClicked = new EventEmitter();

  constructor(
    public authService: AuthService,
    public progressBarService: ProgressBarService,
    private ngZone: NgZone,
  ) {
    super();

    this.authService.currentUser.subscribe(
      user => this.isLogin = !!user
    );
  }

  ngOnInit(): void {
    this.syncPrismTheme();
  }

  onMenuClicked() {
    this.menuClicked.emit();
  }

  onThemeChanged(event: MatRadioChange) {
    this.activeThemeIdx = event.value;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.ngZone.onStable.pipe(
      take(1),
      delay(200),
    ).subscribe(() => {
      this.syncPrismTheme()
    })
  }

  private syncPrismTheme() {
    NavbarComponent.loadPrismTheme(this.isDarkMode ?
      'assets/prism-theme/prism-one-light.css' : 'assets/prism-theme/prism-one-dark.css');
  }

  private static loadPrismTheme(bundleStyleName: string) {
    const prismThemeId = 'prism-theme';
    let themeLink = document.getElementById(prismThemeId) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = bundleStyleName;
    } else {
      const themeLink = document.createElement('link');
      themeLink.id = prismThemeId;
      themeLink.rel = 'stylesheet';
      themeLink.href = `${bundleStyleName}`;

      const head = document.getElementsByTagName('head')[0];
      head.appendChild(themeLink);
    }
  }

}
