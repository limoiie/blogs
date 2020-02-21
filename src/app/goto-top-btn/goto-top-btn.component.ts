import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ScrollOut} from '../scroll-out.directive';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgScrollbar} from 'ngx-scrollbar';

@Component({
  selector: 'app-goto-top-btn',
  templateUrl: './goto-top-btn.component.html',
  styleUrls: ['./goto-top-btn.component.css'],
  animations: [
    trigger('fabInOutTrigger', [
      transition(':enter', [
        style({
          opacity: 0,
          // transform: 'scale(0, 0)'
        }),
        animate('300ms ease-out',
          style({
            opacity: 1,
            // transform: 'scale(1, 1)'
          }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          // transform: 'scale(1, 1)'
        }),
        animate('300ms ease-in',
          style({
            opacity: 0,
            // transform: 'scale(0, 0)'
          }))
      ])
    ]),
  ]
})
export class GotoTopBtnComponent extends ScrollOut implements OnInit {

  @Input() scrollbar: NgScrollbar;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isShown = false;
  }

  gotoTop() {
    this.scrollbar.scrollTo({
      top: 0,
      duration: 1000
    }).then(/* after finishing scrolling */);
  }

}
