import {animate, style, transition, trigger} from '@angular/animations'
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {BlogAbbrev} from '../beans/blog-abbrev'
import {BlogService} from '../services/blog.service'
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.sass'],
  animations: [
    trigger('blogListTrigger', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(24px)'}),
        animate('{{ myTime }} ease-in-out', style({opacity: 1, transform: 'translateY(0)'})),
      ], {delay: '3s'}),
      transition(':leave', [
        animate('100ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class BlogListComponent implements OnInit, AfterViewInit {
  blogList: BlogAbbrev[]
  loading: boolean

  @ViewChild(MatPaginator)
  paginator: MatPaginator

  constructor(
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    // this.loading = true
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((ev: PageEvent) => {
      this.loading = true
      this.blogService.writePageIndex(ev.pageIndex)
      this.blogService.writePageSize(ev.pageSize)

      this._loadBlogs(ev.pageIndex, ev.pageSize, true)
    })

    this.blogService.countBlogs().subscribe(count => {
      this.paginator.length = count
      this.paginator.pageIndex = this.blogService.readPageIndex()
      this.paginator.pageSize = this.blogService.readPageSize()
      this._loadBlogs(this.blogService.readPageIndex(), this.blogService.readPageSize())
    })
  }

  _loadBlogs(pageIndex: number, pageSize: number, scrollToTop: boolean = false) {
    if (scrollToTop) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }

    this.blogService
      .getBlogList(pageIndex, pageSize)
      .subscribe({
          next: (data: { page, count }) => {
            this.blogList = data.page
            this.paginator.length = data.count
          },
          error: (err) => this.snackBar.open(`Err: ${err}`, 'OK'),
          complete: () => this.loading = false
        }
      )
  }
}
