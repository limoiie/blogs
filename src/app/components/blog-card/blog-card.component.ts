import {animate, style, transition, trigger} from '@angular/animations'
import {Component, Input, OnInit} from '@angular/core'
import {WithAbstractBlog} from '../../beans/blog'
import {AuthService} from '../../services/auth.service'

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
  @Input() blog?: WithAbstractBlog

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    //  nothing to do
  }

  onEdit(): void {
    // todo
    // const dialogRef = this.matDialog.open(BlogPublishFormComponent, {
    //   height: '400px', width: '600px', data: this.blog
    // })
    // dialogRef.afterClosed().pipe(
    //   filter(val => val as boolean)
    // ).subscribe((data: { title, folder, tags, visibility }) => {
    //   this.blog.title = data.title
    //   this.blog.folder = data.folder
    //   if (data.tags != undefined)
    //     this.blog.tags = data.tags
    //   this.blog.visibility = data.visibility
    // })
  }
}
