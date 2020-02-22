import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BlogService} from '../blog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {assertNotNull} from '@angular/compiler/src/output/output_ast';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';


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
    author: new FormControl({value: null, disabled: true}),
    createTime: new FormControl({value: null, disabled: true}),
    editTime: new FormControl({value: null, disabled: true}),
    folder: new FormControl(),
    tags: new FormControl(),
    abstract: new FormControl(),
    mdDocument: new FormControl(),
    htmlDocument: new FormControl()
  });

  constructor(
    private blogService: BlogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BlogPublishFormComponent>
  ) {
    this.folders$ = this.blogService.loadFolders();

    console.assert(this.notEmptyField(data.author));
    console.assert(this.notEmptyField(data.mdDocument));
    console.assert(this.notEmptyField(data.htmlDocument));

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

  ngOnInit(): void {
  }

  closeDialog() {
    console.log('form tags: ', this.form.controls.tags.value);
    this.dialogRef.close({
      title: this.form.controls.title.value,
      folder: this.form.controls.folder.value,
      tags: this.form.controls.tags.value.tags
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.closeDialog();
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

  notEmptyField(field: string) {
    return isNotNullOrUndefined(field) && field.length > 0;
  }

}
