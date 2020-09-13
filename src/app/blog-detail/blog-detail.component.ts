import {
  Component,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiResponse, BlogService} from '../services/blog.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {MarkdownComponent, MarkdownService} from 'ngx-markdown';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TableOfContentComponent} from '../table-of-content/table-of-content.component';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.sass'],
  animations: [
    trigger('blogTrigger', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(128px)'}),
        animate('400ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({opacity: 0}))
      ])
    ]),
  ]
})
export class BlogDetailComponent implements OnInit {

  @ViewChild('toc') toc: TableOfContentComponent;
  @ViewChild('content') content: MarkdownComponent;

  secName = 'Content';
  loading = true;
  blog = {
    title: '',
    createTime: '',
    editTime: '',
    folder: '',
    author: '',
    tags: [],
    mdDocument: ''
  };

  markdown = null;
  constructor(
    private route: ActivatedRoute,
    private mdService: MarkdownService,
    private blogService: BlogService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const blogId = +params.get('blogId');
      this.loadBlogDetail(blogId);
    });
  }

  loadBlogDetail(blogId: number) {
    this.blogService.getBlogDetail(blogId)
      .subscribe((response: ApiResponse) => {
        if (response.state) {
          this.blog = response.data;
          this.ngZone.onStable.pipe(take(1))
            .subscribe(() => {
              this.toc.addHeaders(this.secName,
                this.content.element.nativeElement);
              //
              this.ngZone.run(() => {
                this.loading = false;
              });
            });
        } else {
          const msg = `Failed to load blog: ${response.message}`;
          this.snackBar.open(msg, 'Ok');
          this.loading = false;
        }
      });
  }

}
