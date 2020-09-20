import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
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
    public progressBarService: ProgressBarService
  ) {
    super();

    this.authService.currentUser.subscribe(
      user => this.isLogin = !!user
    );
  }

  ngOnInit(): void {
  }

  onMenuClicked() {
    this.menuClicked.emit();
  }

  onThemeChanged(event: MatRadioChange) {
    this.activeThemeIdx = event.value;
  }

}
