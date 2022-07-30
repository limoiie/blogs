import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {delay} from 'rxjs/operators';
import {BlogAbbrev} from '../beans/blog-abbrev';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.sass'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('200ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('40ms', style({opacity: 0}))
      ])
    ]),
  ]
})
export class BlogCardComponent implements OnInit {

  @Input() blog: BlogAbbrev

  constructor(
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

}
