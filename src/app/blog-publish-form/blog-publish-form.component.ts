import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService, PublishResponse} from '../blog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-blog-publish-form',
  templateUrl: './blog-publish-form.component.html',
  styleUrls: ['./blog-publish-form.component.css']
})
export class BlogPublishFormComponent implements OnInit {

  folders$;
  minAbstractLen = 80;
  maxAbstractLen = 400;
  form = new FormGroup({
    title: new FormControl(),
    author: new FormControl(),
    createTime: new FormControl(),
    editTime: new FormControl(),
    folder: new FormControl(),
    tags: new FormControl(),
    abstract: new FormControl(),
    mdDocument: new FormControl(),
    htmlDocument: new FormControl()
  });

  constructor(
    private blogService: BlogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BlogPublishFormComponent>,
    private snackBar: MatSnackBar
  ) {
    this.folders$ = this.blogService.loadFolders();

    console.assert(BlogPublishFormComponent.notEmptyField(data.author));
    console.assert(BlogPublishFormComponent.notEmptyField(data.mdDocument));
    console.assert(BlogPublishFormComponent.notEmptyField(data.htmlDocument));

    const ctrls = this.form.controls;
    ctrls.title.setValue(data.title);
    ctrls.author.setValue(data.author);
    ctrls.createTime.setValue(data.createTime || new Date());
    ctrls.editTime.setValue(data.editTime || new Date());
    ctrls.folder.setValue(data.folder || '');
    ctrls.tags.setValue(data.tags || []);
    ctrls.abstract.setValue(data.abstract || '');
    ctrls.mdDocument.setValue(data.mdDocument);
    ctrls.htmlDocument.setValue(data.htmlDocument);
  }

  private static notEmptyField(field: string) {
    return isNotNullOrUndefined(field) && field.length > 0;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    // console.log('form tags: ', this.form.controls.tags.value);
    this.dialogRef.close({
      title: this.form.controls.title.value,
      folder: this.form.controls.folder.value,
      tags: this.form.controls.tags.value.tags
    });
  }

  formatDate(date: Date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${y}/${m}/${d} ${hours}:${minutes}:${seconds}`;
  }

  packageData(data) {
    data.tags = data.tags.tags;
    data.createTime = this.formatDate(data.createTime);
    data.editTime = this.formatDate(data.editTime);
    return data;
  }

  onSubmit() {
    const value = this.packageData(Object.assign({}, this.form.value));

    console.log('send request: ', value);
    this.blogService.publishBlog(value).subscribe(
      (data: PublishResponse) => {
        console.log('received response: ', data);
        let msg: string;
        if (data.state === true) {
          msg = `Publish successfully! New blog id: ${data.blogId}`;
          this.closeDialog();
        } else {
          msg = `Failed to publish, ${data.message} try later`;
        }
        this.snackBar.open(msg, 'Ok', {duration: 1500});
      }
    );
  }

  getAbstractErrorMessage() {
    const len = this.form.controls.abstract.value.length;
    if (len < this.minAbstractLen) {
      return `${len} (< ${this.minAbstractLen}) characters are too short`;
    }
    if (len > this.maxAbstractLen) {
      return `${len} (> ${this.maxAbstractLen}) characters are too long`;
    }
  }

}
