import {animate, state, style, transition, trigger} from '@angular/animations'
import {Component, OnInit, ViewChild} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {MatSnackBar} from '@angular/material/snack-bar'
import {ActivatedRoute} from '@angular/router'
import {PagedResourceCollection} from '@lagoshny/ngx-hateoas-client'
import {combineLatest, mergeMap, of} from 'rxjs'
import {delay, filter, map, tap} from 'rxjs/operators'
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
      state('void', style({opacity: 0, transform: 'translateY(24px)'})),
      state('*', style({opacity: 1, transform: 'translateY(0)'})),
      transition(
        ':enter', [
          animate('{{ myTime }} ease-in-out')
        ]
      ),
      transition(
        ':leave',
        [
          style({opacity: 0, transform: 'translateY(0)'}),
          animate('300ms ease-in-out')
        ]
      )
    ]),
    trigger('searchTrigger', [
      state('focused', style({width: '100%'})),
      state('unfocused', style({width: '200px'})),
      transition(
        'focused <=> unfocused', [
          animate('200ms ease-in')
        ]
      )
    ]),
    trigger('filterBoardTrigger', [
      state('true', style({opacity: 1, height: '*'})),
      state('false', style({opacity: 0, height: 0})),
      transition(
        'false <=> true', [
          animate('400ms ease-in-out')
        ]
      )
    ])
  ]
})
export class BlogListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  blogsPager: PagedResourceCollection<WithAbstractBlog> | undefined

  allTagNames: string[] = []

  form: FormGroup = new FormGroup({
    query: new FormControl('', [
      Validators.maxLength(200)
    ]),
    tags: new FormControl(new Set<string>())
  })

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.blogService.tags$.pipe(
        filter(tags => tags.length != 0),
        map(tags => tags.map(tag => tag.name)),
        tap(tags => this.allTagNames = tags)
      )
    ]).pipe(
      tap(([params, allTags]) => {
        const tags = params.get('tags')
        if (tags) {
          for (const tag of tags.split(',')) {
            if (allTags.indexOf(tag) >= 0) {
              this.form.controls['tags'].value.add(tag)
            }
          }
        }
        this.loadBlogs(0, undefined, true)
      })
    ).subscribe()
  }

  onPageOptionChanged(ev$: PageEvent) {
    this.loadBlogs(ev$.pageIndex, ev$.pageSize, true)
  }

  toggleTag(tag: TagComponent) {
    if (tag.selected) {
      this.form.controls['tags'].value.delete(tag.tagName)
    } else {
      this.form.controls['tags'].value.add(tag.tagName)
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

    of(0).pipe(
      tap(() => {
        this.progressBarService.indeterminate()
        if (this.blogsPager) {
          this.blogsPager.resources = []
        }
        if (scrollToTop) window.scrollTo({top: 0, behavior: 'auto'})
      }),
      delay(400),
      mergeMap(() => {
        return this.blogService.getBlogList(pageable, this.buildFilter())
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
    if (
      this.form.controls['tags'].value.size !== 0 ||
      this.form.controls['query'].value
    ) {
      return {
        query: this.form.controls['query'].value,
        tags: [...this.form.controls['tags'].value]
      }
    }
    return undefined
  }
}
