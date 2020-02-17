import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ScrollOut} from '../scroll-out.directive';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('navbarInOutTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)'}),
        animate('300ms ease-out',
          style({ transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-out',
          style({ transform: 'translateY(-100%)' }))
      ])
    ]),
  ]
})
export class NavbarComponent extends ScrollOut implements OnInit {
  isDarkMode = false;

  @Input() isHandset$: Observable<boolean>;
  @Output() menuClicked = new EventEmitter();
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onMenuClicked() {
    this.menuClicked.emit();
  }

}
