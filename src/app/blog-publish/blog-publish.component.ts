import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {BlogPublishFormComponent} from '../blog-publish-form/blog-publish-form.component';
import {MarkdownComponent} from 'ngx-markdown';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BlogService} from '../services/blog.service';

@Component({
  selector: 'app-blog-upload',
  templateUrl: './blog-publish.component.html',
  styleUrls: ['./blog-publish.component.css']
})
export class BlogPublishComponent implements OnInit {
  loading = false;

  // Raw content of the original markdown document
  content = '';

  // Refined markdown document. It will be feed into `MarkdownComponent`
  mdContent = '';

  folder = '';
  tags = [];

  editEventEmitter = new Subject();
  editEvent = this.editEventEmitter.pipe(
    debounceTime(1000)
  );

  @ViewChild('markdown') markdownView: MarkdownComponent;

  constructor(
    private blogService: BlogService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.editEvent.subscribe(
      // TODO: refine the raw markdown file
      (ev: string) => this.mdContent = ev
    );
  }

  onEdit($event) {
    this.editEventEmitter.next($event);
    this.getHtmlDocument();
  }

  onPublish() {
    if (this.content.trim().length === 0) {
      const msg = 'The content is empty! Try writing something.';
      const action = 'Ok';
      this.snackBar.open(msg, action, {duration: 1500});
      return;
    }

    const dialogRef = this.dialog.open(BlogPublishFormComponent, {
      height: '400px', width: '600px',
      data: {
        title: this.getTitle(),
        author: this.getAuthor(),
        abstract: this.getAbstract(),
        mdDocument: this.getMdDocument(),
        htmlDocument: this.getHtmlDocument(),
        folder: this.folder,
        tags: this.tags
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.title) {
          this.updateTitle(result.title);
        }
        this.folder = result.folder || this.folder;
        this.tags = result.tags || this.tags;
      }
    });
  }

  getAuthor() {
    return 'limo';
  }

  getTitle() {
    const r = /^# .*/.exec(this.content.trim());
    return r ? r[0].slice(2) : '';
  }

  getAbstract() {
    const r = /^# .*\n/.exec(this.content);
    const r2 = /\n## /.exec(this.content);
    if (r) {
      const start = r.index + r[0].length;
      const end = r2 ? r2.index : -1;
      return this.content.slice(start, end).trim();
    }
    return '';
  }

  getMdDocument() {
    return this.content;
  }

  getHtmlDocument() {
    return this.markdownView.element.nativeElement.innerHTML;
  }

  updateTitle(updatedTitle: string) {
    // update content editor
    this.content = this.content.trim()
      .replace(/^# .*/, `# ${updatedTitle}`);

    // update markdown preview
    this.onEdit(this.content);
  }

}
