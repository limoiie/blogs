import {animate, style, transition, trigger} from '@angular/animations'
import {Component, Input, OnInit} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {filter} from 'rxjs/operators'
import {WithAbstractBlog} from '../../beans/blog'
import {AuthService} from '../../services/auth.service'
import {
  BlogPublishFormComponent
} from '../blog-publish-form/blog-publish-form.component'

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.sass'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0}),
        animate('200ms', style({opacity: 1}))
      ]),
      transition(':leave', [animate('40ms', style({opacity: 0}))])
    ])
  ]
})
export class BlogCardComponent implements OnInit {
  @Input() blog!: WithAbstractBlog

  constructor(
    public authService: AuthService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    //  nothing to do
  }

  onEdit(): void {
    const dialogRef = this.matDialog.open(BlogPublishFormComponent, {
      height: '400px', width: '600px', data: this.blog
    })
    dialogRef.afterClosed().pipe(
      filter(val => val as boolean)
    ).subscribe((data: {title: string, folder: string, tags: string[], visibility: boolean}) => {
      this.blog.title = data.title
      this.blog.folder = data.folder
      if (data.tags != undefined)
        this.blog.tags = data.tags
      this.blog.visibility = data.visibility
    })
  }
}