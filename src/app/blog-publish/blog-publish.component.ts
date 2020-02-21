import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {BlogPublishFormComponent} from '../blog-publish-form/blog-publish-form.component';

@Component({
  selector: 'app-blog-upload',
  templateUrl: './blog-publish.component.html',
  styleUrls: ['./blog-publish.component.css']
})
export class BlogPublishComponent implements OnInit {
  loading = false;
  content = '';
  markdown = '';

  editEventEmitter = new Subject();
  editEvent = this.editEventEmitter.pipe(
    debounceTime(1000)
  );

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.editEvent.subscribe((ev: string) => {
      this.markdown = ev;
    });
  }

  onEdit($event) {
    this.editEventEmitter.next($event);
  }

  onPublish() {
    const dialogRef = this.dialog.open(BlogPublishFormComponent, {
      height: '400px', width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

}
