import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {map} from "rxjs/operators"
import {BlogAbbrev} from "../beans/blog-abbrev";
import {ApiResponse, extractData} from "./api-response";
import {ApiService} from './api.service'


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private pageIndex: number = 0
  private pageSize: number = 15

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
  }

  // noinspection JSUnusedGlobalSymbols
  loadBlogList() {
    return this.http.get('/assets/blog-list.fake.json')
  }

  // noinspection JSUnusedGlobalSymbols
  loadBlog(_id) {
    return this.http.get('/assets/blog.fake.json')
  }

  loadFolders() {
    return this.http.get<string[]>('/assets/folders.fake.json')
  }

  loadTags() {
    return this.http.get('/assets/tags.fake.json')
  }

  publishBlog(blog): Observable<any> {
    return this.api.apiPost<ApiResponse>(`/blog/publish/`, blog).pipe(
      map(response => extractData(response))
    )
  }

  getBlogList(pageNum, pageSize): Observable<any> {
    return this.api.apiGet<ApiResponse>(`/blog/list/${pageNum}/${pageSize}`).pipe(
      map(response => extractData(response))
    )
  }

  getBlogDetail(blogId): Observable<BlogAbbrev> {
    return this.api.apiGet<ApiResponse<BlogAbbrev>>(`/blog/${blogId}/`).pipe(
      map(response => extractData(response))
    )
  }

  countBlogs(): Observable<number> {
    return this.api.apiGet<ApiResponse<number>>(`/blog/count/`).pipe(
      map(response => extractData(response))
    )
  }

  readPageIndex(): number {
    return this.pageIndex
  }

  readPageSize(): number {
    return this.pageSize
  }

  writePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
  }

  writePageSize(pageSize: number) {
    this.pageSize = pageSize
  }
}
