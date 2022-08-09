import {animate, style, transition, trigger} from '@angular/animations'
import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {MatSnackBar} from '@angular/material/snack-bar'
import {PagedResourceCollection} from '@lagoshny/ngx-hateoas-client'
import {delay, tap} from 'rxjs/operators'
import {WithAbstractBlog} from '../../beans/blog'
import {BlogService} from '../../services/blog.service'
import {ProgressBarService} from '../../services/progress-bar.service'

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.sass'],
  animations: [
    trigger('blogListTrigger', [
      transition(
        ':enter',
        [
          style({opacity: 0, transform: 'translateY(24px)'}),
          animate(
            '{{ myTime }} ease-in-out',
            style({opacity: 1, transform: 'translateY(0)'})
          )
        ]
      ),
      transition(
        ':leave',
        [
          animate('300ms ease-in-out',
            style({opacity: 0}))
        ])
    ])
  ]
})
export class BlogListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  blogsPager: PagedResourceCollection<WithAbstractBlog> | undefined

  constructor(
    private blogService: BlogService,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar
  ) {
    this._loadBlogs(this.blogService.pageIndex, this.blogService.pageSize, true)
  }

  ngOnInit(): void {
    //  nothing to do
  }

  onPageOptionChanged(ev$: PageEvent) {
    this._loadBlogs(ev$.pageIndex, ev$.pageSize, true)
  }

  _loadBlogs(pageIndex: number, pageSize: number, scrollToTop = false) {
    if (this.blogsPager) {
      this.blogsPager.resources = []
    }

    this.progressBarService.indeterminate()
    this.blogService.getBlogList(pageIndex, pageSize).pipe(
      delay(400),
      tap(() => {
        if (scrollToTop) window.scrollTo({top: 0, behavior: 'auto'})
      })
    ).subscribe({
      next: (data) => (this.blogsPager = data),
      error: (err) => {
        this.snackBar.open(`Err: ${err}`, 'OK')
        this.progressBarService.stop()
      },
      complete: () => (this.progressBarService.stop())
    })
  }
}
