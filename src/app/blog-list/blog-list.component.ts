import {animate, style, transition, trigger} from '@angular/animations'
import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {MatSnackBar} from '@angular/material/snack-bar'
import {PagedResourceCollection} from '@lagoshny/ngx-hateoas-client'
import {WithAbstractBlog} from '../beans/blog'
import {BlogService} from '../services/blog.service'

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
        ],
        {delay: '300ms'}
      ),
      transition(':leave', [animate('300ms ease-in-out', style({opacity: 0}))])
    ])
  ]
})
export class BlogListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator

  loading = false
  blogsPager: PagedResourceCollection<WithAbstractBlog> | undefined
  blogsInPage: WithAbstractBlog[] = []
  nTotalBlogs = 0

  constructor(private blogService: BlogService, private snackBar: MatSnackBar) {
    this._loadBlogs(this.blogService.pageIndex, this.blogService.pageSize)
  }

  ngOnInit(): void {
    //  nothing to do
  }

  onPageOptionChanged(ev$: PageEvent) {
    this._loadBlogs(ev$.pageIndex, ev$.pageSize, true)
  }

  _loadBlogs(pageIndex: number, pageSize: number, scrollToTop = false) {
    this.loading = true

    if (scrollToTop) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }

    this.blogService.getBlogList(pageIndex, pageSize).subscribe({
      next: (data) => {
        this.blogsPager = data
        this.blogsInPage = data.resources
        this.nTotalBlogs = data.totalElements
      },
      error: (err) => {
        this.loading = false
        this.snackBar.open(`Err: ${err}`, 'OK')
      },
      complete: () => (this.loading = false)
    })
  }
}
