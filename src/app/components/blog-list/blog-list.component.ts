import {animate, style, transition, trigger} from '@angular/animations'
import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {MatSnackBar} from '@angular/material/snack-bar'
import {PagedResourceCollection} from '@lagoshny/ngx-hateoas-client'
import {delay, tap} from 'rxjs/operators'
import {WithAbstractBlog} from '../../beans/blog'
import {BlogFilter} from '../../beans/blog-filter'
import {BlogService} from '../../services/blog.service'
import {ProgressBarService} from '../../services/progress-bar.service'
import {TagComponent} from '../tag/tag.component'

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

  allTagNames: string[] = []
  filteredTags: Set<string> = new Set<string>([])

  constructor(
    private blogService: BlogService,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar
  ) {
    this.loadBlogs(undefined, undefined, true)
    this.blogService.tags$.subscribe(allTags => {
      this.allTagNames = allTags.map(tag => tag.name)
    })
  }

  ngOnInit(): void {
    //  nothing to do
  }

  onPageOptionChanged(ev$: PageEvent) {
    this.loadBlogs(ev$.pageIndex, ev$.pageSize, true)
  }

  toggleTag(tag: TagComponent) {
    tag.toggleSelected()
    if (tag.selected) {
      this.filteredTags.add(tag.tagName)
    } else {
      this.filteredTags.delete(tag.tagName)
    }
  }

  applyFilter() {
    this.loadBlogs(0, undefined, true)
  }

  private loadBlogs(
    page: number | undefined = undefined,
    size: number | undefined = undefined,
    scrollToTop = false
  ) {
    const pageable = {
      pageParams: {
        page: page === undefined ? this.blogService.page : page,
        size: size === undefined ? this.blogService.size : size
      }
      //  todo: sort
    }

    if (this.blogsPager) {
      this.blogsPager.resources = []
    }

    this.progressBarService.indeterminate()
    this.blogService.getBlogList(pageable, this.buildFilter()).pipe(
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

  private buildFilter(): BlogFilter | undefined {
    if (this.filteredTags.size !== 0) {
      return {
        tags: [...this.filteredTags]
      }
    }
    return undefined
  }
}
