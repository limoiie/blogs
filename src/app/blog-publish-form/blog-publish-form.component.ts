import {Component, Inject, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Observable} from "rxjs";
import {BlogAbbrev} from "../beans/blog-abbrev";
import {BlogService} from '../services/blog.service'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'


@Component({
  selector: 'app-blog-publish-form',
  templateUrl: './blog-publish-form.component.html',
  styleUrls: ['./blog-publish-form.component.css']
})
export class BlogPublishFormComponent implements OnInit {

  folders$: Observable<string[]>

  form: FormGroup

  maxTitleLen: number = 200
  minAbstractLen: number = 80
  maxAbstractLen: number = 400

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BlogAbbrev,
    public dialogRef: MatDialogRef<BlogPublishFormComponent>,
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
    this.folders$ = this.blogService.loadFolders()
    this.form = new FormGroup({
      id: new FormControl(data.id),
      title: new FormControl(data.title, [Validators.required, Validators.maxLength(this.maxTitleLen)]),
      author: new FormControl(data.author),
      createTime: new FormControl(data.createTime ? new Date(data.createTime) : new Date()),
      editTime: new FormControl(data.editTime ? new Date(data.editTime) : new Date()),
      folder: new FormControl(data.folder || ''),
      tags: new FormControl([...data.tags] || []),
      visibility: new FormControl(data.visibility),
      abstract: new FormControl(data.abstract || '', [
        Validators.required, Validators.minLength(this.minAbstractLen), Validators.maxLength(this.maxAbstractLen)]),
      mdDocument: new FormControl(data.mdDocument),
      htmlDocument: new FormControl(data.htmlDocument)
    })
  }

  ngOnInit(): void {
  }

  closeDialog(updated) {
    // console.log('form tags: ', this.form.controls.tags.value)
    this.dialogRef.close(updated)
  }

  onSubmit() {
    const value = this.packageData(Object.assign({}, this.form.value))
    this.blogService.publishBlog(value).subscribe({
      next: (blogId: string) => {
        this.snackBar.open(`Succeed to publish: ${blogId}`, 'Ok', {duration: 5000})
        this.closeDialog({
          title: this.form.controls.title.value,
          folder: this.form.controls.folder.value,
          tags: this.form.controls.tags.value.tags,
          visibility: this.form.controls.visibility.value,
        })
      },
      error: err => this.snackBar.open(`Failed to publish: ${err}`, 'Ok')
    })
  }

  private packageData(data) {
    data.tags = data.tags.tags
    data.createTime = (data.createTime as Date).getTime()
    data.editTime = (data.editTime as Date).getTime()
    return data
  }

}
