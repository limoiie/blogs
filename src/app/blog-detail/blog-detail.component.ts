import {animate, style, transition, trigger} from '@angular/animations'
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {ActivatedRoute, Router} from '@angular/router'
import {MarkdownService} from 'ngx-markdown'
import {delay, first} from 'rxjs/operators'
import {WithHtmlDocumentBlog} from '../beans/blog'
import {renderHeading} from '../markdown-render-custom'
import {BlogService} from '../services/blog.service'
import {ProgressBarService} from '../services/progress-bar.service'
import {
  TableOfContentComponent
} from '../table-of-content/table-of-content.component'

declare let Prism: {
  highlightAllUnder: (element: Element | Document) => void
}

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.sass'],
  animations: [
    trigger('blogTrigger', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(48px)'}),
        animate(
          '400ms ease-in',
          style({opacity: 1, transform: 'translateY(0)'})
        )
      ]),
      transition(
        ':leave',
        [
          animate('400ms ease-out',
            style({opacity: 0}))
        ])
    ])
  ]
})
export class BlogDetailComponent implements OnInit {
  @ViewChild('toc') toc!: TableOfContentComponent
  @ViewChild('content') content!: ElementRef

  blog: WithHtmlDocumentBlog | undefined

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mdService: MarkdownService,
    private blogService: BlogService,
    private progressBarService: ProgressBarService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.mdService.renderer.heading = (text, level, raw, slugger) => {
      return renderHeading(this.router.url, text, level, raw, slugger)
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loadBlogDetail(params.get('blogId'))
    })
  }

  loadBlogDetail(blogId: string | null) {
    if (!blogId) {
      return
    }

    this.blog = undefined

    this.progressBarService.indeterminate()
    this.blogService.getBlogDetail(blogId).pipe(delay(400)).subscribe({
      next: (blog) => {
        this.blog = blog
        this.ngZone.onStable.pipe(first()).subscribe(() => {
          this.ngZone.run(() => {
            this.toc.constructTOC(this.content.nativeElement)
            Prism.highlightAllUnder(this.content.nativeElement)
          })
        })
      },
      error: (err) => {
        this.snackBar.open(`Failed to load blog: ${err}`, 'Ok')
        this.progressBarService.stop()
      },
      complete: () => (this.progressBarService.stop())
    })
  }
}
