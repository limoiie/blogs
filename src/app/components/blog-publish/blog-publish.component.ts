import {Component, OnInit, ViewChild} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {MarkdownComponent} from 'ngx-markdown'
import {Subject} from 'rxjs'
import {debounceTime} from 'rxjs/operators'
import {BlogPublishFormComponent} from '../blog-publish-form/blog-publish-form.component'
import {BlogService} from '../../services/blog.service'

export type EditAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikthrough'
  | 'highlight'
  | 'quote'
  | 'code'
  | 'latex'
  | 'image'
  | 'link'

@Component({
  selector: 'app-blog-upload',
  templateUrl: './blog-publish.component.html',
  styleUrls: ['./blog-publish.component.sass']
})
export class BlogPublishComponent implements OnInit {
  loading = false

  // Raw content of the original Markdown document
  content = ''

  // Refined Markdown document. It will be feed into `MarkdownComponent`
  mdContent = ''

  folder = ''
  tags = []

  editEventEmitter = new Subject<string>()
  editEvent = this.editEventEmitter.pipe(debounceTime(1000))

  @ViewChild('markdown') markdownView!: MarkdownComponent

  constructor(
    private blogService: BlogService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editEvent.subscribe(
      // TODO: refine the raw markdown file
      (ev: string) => (this.mdContent = ev)
    )
  }

  onEdit($event: string) {
    this.editEventEmitter.next($event)
    this.getHtmlDocument()
  }

  onPublish() {
    if (this.content.trim().length === 0) {
      const msg = 'The content is empty! Try writing something.'
      const action = 'Ok'
      this.snackBar.open(msg, action, {duration: 1500})
      return
    }

    const dialogRef = this.dialog.open(BlogPublishFormComponent, {
      height: '400px',
      width: '600px',
      data: {
        title: this.getTitle(),
        author: this.getAuthor(),
        abstract: this.getAbstract(),
        mdDocument: this.getMdDocument(),
        htmlDocument: this.getHtmlDocument(),
        folder: this.folder,
        tags: this.tags
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.title) {
          this.updateTitle(result.title)
        }
        this.folder = result.folder || this.folder
        this.tags = result.tags || this.tags
      }
    })
  }

  getAuthor() {
    return 'limo'
  }

  getTitle() {
    const r = /^# .*/.exec(this.content.trim())
    return r ? r[0].slice(2) : ''
  }

  getAbstract() {
    const r = /^# .*\n/.exec(this.content)
    const r2 = /\n## /.exec(this.content)
    if (r) {
      const start = r.index + r[0].length
      const end = r2 ? r2.index : -1
      return this.content.slice(start, end).trim()
    }
    return ''
  }

  getMdDocument() {
    return this.content
  }

  getHtmlDocument() {
    return this.markdownView.element.nativeElement.innerHTML
  }

  updateTitle(updatedTitle: string) {
    // update content editor
    this.content = this.content.trim().replace(/^# .*/, `# ${updatedTitle}`)

    // update markdown preview
    this.onEdit(this.content)
  }

  onEditAction(event: Event, action: EditAction) {
    // prevent losing the focus on textarea
    event.preventDefault()
    const editArea = document.getElementById('edit-area') as HTMLTextAreaElement
    switch (action) {
    case 'bold':
      this.content = insertTextAtCursor(editArea, '**', '**')
      break
    case 'italic':
      this.content = insertTextAtCursor(editArea, '*', '*')
      break
    case 'underline':
      this.content = insertTextAtCursor(editArea, '<u>', '</u>')
      break
    case 'strikthrough':
      this.content = insertTextAtCursor(editArea, '~~', '~~')
      break
    case 'highlight':
      this.content = insertTextAtCursor(editArea, '`', '`')
      break
    case 'quote':
      this.content = insertTextBeforeLine(editArea, '> ')
      break
    case 'code':
      this.content = insertTextAtCursor(editArea, '\n```\n', '\n```')
      break
    case 'latex':
      this.content = insertTextAtCursor(editArea, '$', '$')
      break
    case 'image':
      this.content = insertTextAtCursor(editArea, '![]()')
      break
    case 'link':
      this.content = insertTextAtCursor(editArea, '[]()')
      break
    }

    this.onEdit(this.content)
  }
}

function insertTextAtCursor(textarea: HTMLTextAreaElement, left: string, right = '') {
  const val = textarea.value
  const prev = val.slice(0, textarea.selectionStart)
  const post = val.slice(textarea.selectionEnd)
  const selected = val.slice(textarea.selectionStart, textarea.selectionEnd)
  textarea.value = prev + left + selected + right + post
  textarea.selectionStart = textarea.selectionEnd =
    textarea.selectionStart + left.length + selected.length + right.length
  return textarea.value
}

function insertTextBeforeLine(textarea: HTMLTextAreaElement, txt: string) {
  const val = textarea.value
  const prev: string = val.slice(0, textarea.selectionStart)
  const post: string = val.slice(textarea.selectionEnd)
  const selected: string = val.slice(
    textarea.selectionStart,
    textarea.selectionEnd
  )
  const inserted = Array.from(selected.split('\n'))
    .map((line) => txt + line + '\n')
    .reduce((p, c) => p + c)
  textarea.value = prev + inserted + post
  textarea.selectionStart = textarea.selectionEnd =
    textarea.selectionStart + inserted.length
  return textarea.value
}
