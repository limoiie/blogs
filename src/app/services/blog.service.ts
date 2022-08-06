import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {
  HateoasResourceService,
  PagedResourceCollection
} from '@lagoshny/ngx-hateoas-client'
import {CookieService} from 'ngx-cookie-service'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {WithHtmlDocumentBlog, WithAbstractBlog} from '../beans/blog'
import {BlogAbbrev} from '../beans/blog-abbrev'
import {ApiResponse, extractData} from './api-response'
import {ApiService} from './api.service'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private pageOption = {
    pageIndex: 0,
    pageSize: 20
  }

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private resourceService: HateoasResourceService,
    private cookieService: CookieService
  ) {
    if (cookieService.check('pageOption')) {
      this.pageOption = JSON.parse(cookieService.get('pageOption'))
    }
  }

  get pageIndex() {
    return this.pageOption.pageIndex
  }

  get pageSize() {
    return this.pageOption.pageSize
  }

  loadFolders() {
    return this.http.get<string[]>('/assets/folders.fake.json')
  }

  loadTags() {
    return this.http.get('/assets/tags.fake.json')
  }

  publishBlog(blog: any): Observable<any> {
    return this.api
      .apiPost<ApiResponse>('/blog/publish/', blog)
      .pipe(map((response) => extractData(response)))
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
    // this.cookieService.set('pageOption', JSON.stringify(this.pageOption))

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

  countBlogs(): Observable<number> {
    return this.api
      .apiGet<ApiResponse<number>>('/blog/count/')
      .pipe(map((response) => extractData(response)))
  }
}
