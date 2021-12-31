import {animate, style, transition, trigger} from "@angular/animations";
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ApiResponse, BlogService} from '../services/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.sass'],
  animations: [
    trigger('blogListTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('{{ myTime }} ease-in-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BlogListComponent implements OnInit, AfterViewInit {
  blogList;
  loading;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    // this.loading = true;
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((ev: PageEvent) => {
      this.loading = true;
      this.blogService.writePageIndex(ev.pageIndex);
      this.blogService.writePageSize(ev.pageSize);

      this._loadBlogs(ev.pageIndex, ev.pageSize, true);
    });

    this.blogService.countBlogs().subscribe((response: ApiResponse) => {
      this.paginator.length = response.data;
      this.paginator.pageIndex = this.blogService.readPageIndex()
      this.paginator.pageSize = this.blogService.readPageSize()
      this._loadBlogs(this.blogService.readPageIndex(), this.blogService.readPageSize());
    });
  }

  _loadBlogs(pageIndex: number, pageSize: number, scrollToTop: boolean = false) {
    if (scrollToTop) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

    this.blogService
      .getBlogList(pageIndex, pageSize)
      .subscribe(
        (response: ApiResponse) => {
          console.log(`response.data is ${JSON.stringify(response.data['page'])}`);
          if (response.state) {
            this.blogList = response.data['page'];
            this.paginator.length = response.data['count'];
          } else {
            const errMsg = `Failed to load blog: ${response.message}`;
            this.snackBar.open(errMsg, 'OK');
          }
        },
        (err) => {
          this.snackBar.open(`Err: ${err}`, 'OK');
        },
        () => {
          this.loading = false;
        }
      )
  }
}
