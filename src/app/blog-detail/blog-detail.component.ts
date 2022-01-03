import {animate, style, transition, trigger} from '@angular/animations';
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {MarkdownService} from 'ngx-markdown';
import {first} from 'rxjs/operators';
import {renderHeading} from '../markdown-render-custom';
import {ApiResponse, BlogService} from '../services/blog.service';
import {ProgressBarService} from '../services/progress-bar.service';
import {TableOfContentComponent} from '../table-of-content/table-of-content.component';

declare let Prism: {
  highlightAllUnder: (element: Element | Document) => void;
}


@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.sass'],
  animations: [
    trigger('blogTrigger', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(96px)'}),
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
  @ViewChild('content') content: ElementRef;

  secName = 'Content';
  blog = {
    title: '',
    createTime: '',
    editTime: '',
    folder: '',
    author: '',
    tags: [],
    mdDocument: '',
    htmlDocument: '',
  };

  markdown = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mdService: MarkdownService,
    private blogService: BlogService,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.progressBarService.loading = true;
    this.route.paramMap.subscribe(params => {
      const blogId = +params.get('blogId');
      this.loadBlogDetail(blogId);
    });
    this.mdService.renderer.heading = (text, level, raw, slugger) => {
      return renderHeading(this.router.url, text, level, raw, slugger);
    };
  }

  loadBlogDetail(blogId: number) {
    this.blogService.getBlogDetail(blogId)
      .subscribe((response: ApiResponse) => {
        if (response.state) {
          this.blog = response.data;
          this.ngZone.onStable.pipe(first())
            .subscribe(() => {
              this.toc.addHeaders(this.secName,
                this.content.nativeElement);
              this.ngZone.run(() => {
                this.progressBarService.loading = false;
              });
              Prism.highlightAllUnder(this.content.nativeElement);
            });
        } else {
          const msg = `Failed to load blog: ${response.message}`;
          this.snackBar.open(msg, 'Ok');
          this.progressBarService.loading = false;
        }
      });
  }

}
