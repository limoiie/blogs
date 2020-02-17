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
        style({ transform: 'scale(0, 0)'}),
        animate('300ms ease-out',
          style({ transform: 'scale(1, 1)'}))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1, 1)'}),
        animate('200ms ease-in',
          style({ transform: 'scale(0, 0)' }))
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
  }

  gotoTop() {
    this.scrollbar.scrollTo({
      top: 0,
      duration: 1000
    }).then(/* after finishing scrolling */);
  }

}
