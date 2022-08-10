import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {
  HateoasResourceService,
  PagedResourceCollection,
  RequestOption,
  Resource
} from '@lagoshny/ngx-hateoas-client'
import {RequestBody} from '@lagoshny/ngx-hateoas-client/lib/model/declarations'
import {CookieService} from 'ngx-cookie-service'
import {BehaviorSubject, Observable, of} from 'rxjs'
import {WithAbstractBlog, WithHtmlDocumentBlog} from '../beans/blog'
import {Tag} from '../beans/tag'
import {
  fillProjectionNameFromResourceType
} from '../misc/ngx-hateoas-client-utils'
import {ApiService} from './api.service'

const PAGE_OPTION_KEY = 'pageOption'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private pageOption = {
    pageIndex: 0,
    pageSize: 20
  }

  private tagResCol: PagedResourceCollection<Tag> | undefined
  private tagsSubject = new BehaviorSubject<Tag[]>([])

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private resourceService: HateoasResourceService,
    private cookieService: CookieService
  ) {
    if (cookieService.check(PAGE_OPTION_KEY)) {
      this.pageOption = JSON.parse(cookieService.get(PAGE_OPTION_KEY))
    }

    // preload all the tags
    this.resourceService.getPage(Tag).subscribe(
      (tags) => {
        this.tagResCol = tags
        this.tagsSubject.next(tags.resources)
      }
    )
  }

  get tags(): Tag[] {
    return this.tagResCol?.resources || []
  }

  get pageIndex() {
    return this.pageOption.pageIndex
  }

  get pageSize() {
    return this.pageOption.pageSize
  }

  getBlogList(
    pageNum: number,
    pageSize: number,
    sort: 'ASC' | 'DESC' = 'ASC'
  ): Observable<PagedResourceCollection<WithAbstractBlog>> {
    this.pageOption = {
      pageIndex: pageNum,
      pageSize: pageSize
    }
    this.cookieService.set(PAGE_OPTION_KEY, JSON.stringify(this.pageOption))

    return this.resourceService.getPage(WithAbstractBlog, {
      sort: {
        name: sort
      },
      pageParams: {
        page: pageNum,
        size: pageSize
      }
    })
  }

  getBlogDetail(blogId: number | string): Observable<WithHtmlDocumentBlog> {
    return this.resourceService.getResource(WithHtmlDocumentBlog, blogId)
  }

  patchBlogById<T extends Resource, B = never>(
    blogType: new () => T,
    blogId: string,
    requestBody: RequestBody<B>,
    options?: RequestOption | undefined
  ): Observable<T> {
    options = fillProjectionNameFromResourceType(blogType, options)
    return this.resourceService.patchResourceById(blogType, blogId, requestBody, options)
  }

  loadFolders(): Observable<string[]> {
    return of([])
  }
}
