import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {
  HateoasResourceService,
  PagedResourceCollection,
  RequestOption,
  Resource,
  ResourceCollection
} from '@lagoshny/ngx-hateoas-client'
import {RequestBody} from '@lagoshny/ngx-hateoas-client/lib/model/declarations'
import {CookieService} from 'ngx-cookie-service'
import {BehaviorSubject, Observable} from 'rxjs'
import {WithAbstractBlog, WithHtmlDocumentBlog} from '../beans/blog'
import {BlogFilter, blogFilterToParams} from '../beans/blog-filter'
import {Pageable} from '../beans/pageable'
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
  private pageOption: Pageable = {
    pageParams: {
      page: 0,
      size: 20
    }
  }

  private tagResCol: ResourceCollection<Tag> | undefined
  private tagsSubject = new BehaviorSubject<Tag[]>([])
  tags$ = this.tagsSubject.asObservable()

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
    this.resourceService.getCollection(Tag).subscribe(
      (tags) => {
        this.tagResCol = tags
        this.tagsSubject.next(tags.resources)
      }
    )
  }

  get tags(): Tag[] {
    return this.tagResCol?.resources || []
  }

  get page() {
    return this.pageOption.pageParams.page
  }

  get size() {
    return this.pageOption.pageParams.size
  }

  getBlogList(
    pageable: Pageable,
    filter: BlogFilter | undefined = undefined
  ): Observable<PagedResourceCollection<WithAbstractBlog>> {
    this.pageOption = pageable
    this.cookieService.set(PAGE_OPTION_KEY, JSON.stringify(this.pageOption))

    if (filter !== undefined) {
      return this.resourceService.searchPage(WithAbstractBlog, 'findByFilter', {
        ...pageable,
        params: {
          ...blogFilterToParams(filter)
        }
      })
    }

    return this.resourceService.getPage(WithAbstractBlog, pageable)
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
}
