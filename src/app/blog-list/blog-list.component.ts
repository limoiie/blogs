import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {BlogService} from '../blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.sass'],
  animations: []
})
export class BlogListComponent implements OnInit {
  blogList;
  loading;

  constructor(
    private blogService: BlogService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.blogService
      .loadBlogList()
      .subscribe(
        (blogs) => {
          this.blogList = blogs;
        },
        (err) => {
          this.loading = false;
          window.alert('ERROR: ' + err);
        },
        () => {
          this.loading = false;
        }
      );
  }
}
