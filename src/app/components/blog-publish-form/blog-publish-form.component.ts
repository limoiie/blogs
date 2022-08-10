import {Component, Inject} from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {WithAbstractBlog} from '../../beans/blog'
import {BlogService} from '../../services/blog.service'

@Component({
  selector: 'app-blog-publish-form',
  templateUrl: './blog-publish-form.component.html',
  styleUrls: ['./blog-publish-form.component.css']
})
export class BlogPublishFormComponent {
  form: FormGroup

  maxTitleLen = 200
  minAbstractLen = 80
  maxAbstractLen = 400

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WithAbstractBlog,
    public dialogRef: MatDialogRef<BlogPublishFormComponent>,
    private blogService: BlogService,
    private snackBar: MatSnackBar
  ) {
    this.form = new FormGroup({
      id: new FormControl(data.id),
      title: new FormControl(data.title, [
        Validators.required,
        Validators.maxLength(this.maxTitleLen)
      ]),
      author: new FormControl(data.author?.username),
      createTime: new FormControl(
        data.createTime ? new Date(data.createTime) : new Date()
      ),
      editTime: new FormControl(
        data.editTime ? new Date(data.editTime) : new Date()
      ),
      folder: new FormControl(data.folder || ''),
      tags: new FormControl([...data.tags] || []),
      visibility: new FormControl(data.visibility),
      abstract: new FormControl(data.abstract || '', [
        Validators.required,
        Validators.minLength(this.minAbstractLen),
        Validators.maxLength(this.maxAbstractLen)
      ])
    })
  }

  closeDialog(updated: WithAbstractBlog) {
    this.dialogRef.close(updated)
  }

  onSubmit() {
    this.blogService.patchBlogById(WithAbstractBlog, this.data.id, {
      body: getDirtyFormValue(this.form)
    })
      .subscribe({
        next: (blog) => {
          this.snackBar.open(`Succeed to patch: ${blog.title}`, 'Ok')
          this.closeDialog(blog)
        },
        error: (err) => this.snackBar.open(`Failed to publish: ${err}`, 'Ok')
      })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDirtyFormValue(form: AbstractControl<any, any>) {
  if (form instanceof FormGroup) {
    const dirtyValue: {[key: string]: object} = {}
    Object.keys(form.controls).forEach(
      (controlName) => {
        const control = form.controls[controlName]
        if (control.dirty) {
          dirtyValue[controlName] = getDirtyFormValue(control)
        }
      }
    )
    return dirtyValue
  }
  return form.value
}
