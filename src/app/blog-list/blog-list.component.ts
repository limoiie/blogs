import {Component, OnInit} from '@angular/core';
import {ApiResponse, BlogService} from '../blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.blogService
      .getBlogList(1, 10)
      .subscribe(
        (response: ApiResponse) => {
          if (response.state) {
            this.blogList = response.data;
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
      );
  }
}
