import {Injectable} from '@angular/core';
import {HttpClient, HttpXsrfTokenExtractor} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface PublishResponse {
  state: boolean;
  message: string;
  blogId: number;
}

export interface ApiResponse {
  state: boolean;
  message: string;
  data: any;
}


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  restUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private httpXsrfTokenExtractor: HttpXsrfTokenExtractor
  ) {
  }

  apiGet(url, opt?) {
    return this.http.get(`${this.restUrl}${url}`, opt);
  }

  loadBlogList() {
    return this.http.get('/assets/blog-list.fake.json');
  }

  loadBlog(id) {
    return this.http.get('/assets/blog.fake.json');
  }

  loadFolders() {
    return this.http.get('/assets/folders.fake.json');
  }

  loadTags() {
    return this.http.get('/assets/tags.fake.json');
  }

  addCsrfHeader(opt) {
    opt = opt || {};
    opt.headers = opt.headers || {};

    opt.headers['X-CSRFToken'] =
      this.httpXsrfTokenExtractor.getToken();
    opt.withCredentials = true;
    return opt;
  }

  apiPost(url, data, opt?) {
    opt = this.addCsrfHeader(opt);
    return this.http.post(`${this.restUrl}${url}`, data, opt);
  }

  publishBlog(blog): Observable<any> {
    const url = `/blog/publish/`;
    return this.apiPost(url, blog);
  }

  getBlogList(pageNum, pageSize): Observable<any> {
    const url = `/blog/list/${pageNum}/${pageSize}`;
    return this.apiGet(url);
  }

  getBlogDetail(blogId): Observable<any> {
    const url = `/blog/${blogId}/`;
    return this.apiGet(url);
  }

}
