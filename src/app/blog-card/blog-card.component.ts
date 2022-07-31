import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";
import {filter} from 'rxjs/operators';
import {BlogAbbrev} from '../beans/blog-abbrev';
import {BlogPublishFormComponent} from "../blog-publish-form/blog-publish-form.component";
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
    public authService: AuthService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  onEdit(): void {
    const dialogRef = this.matDialog.open(BlogPublishFormComponent, {
      height: '400px', width: '600px', data: this.blog
    })
    dialogRef.afterClosed().pipe(
      filter(val => val as boolean)
    ).subscribe((data: {title, folder, tags, visibility}) => {
      this.blog.title = data.title
      this.blog.folder = data.folder
      if (data.tags != undefined)
        this.blog.tags = data.tags
      this.blog.visibility = data.visibility
    })
  }

}
