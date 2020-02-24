import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiResponse, BlogService} from '../blog.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {MarkdownService} from 'ngx-markdown';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  loading = true;
  blog = {
    title: '',
    createTime: '',
    editTime: '',
    folder: '',
    author: '',
    tags: []
  };

  markdown = null;
  constructor(
    private route: ActivatedRoute,
    private mdService: MarkdownService,
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const blogId = +params.get('blogId');
      this.blogService.getBlogDetail(blogId)
        .subscribe((response: ApiResponse) => {
          console.log('receive: ', response);
          if (response.state) {
            this.blog = response.data;
          } else {
            const msg = `Failed to load blog: ${response.message}`;
            this.snackBar.open(msg, 'Ok');
          }
        });

      this.blogService.loadBlog(+params.get('blogId'))
        .subscribe((blog: any) => {
          this.blog = blog;
          this.loading = false;
        });
    });
  }

}
