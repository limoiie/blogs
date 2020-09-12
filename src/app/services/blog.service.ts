import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';


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

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
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

  publishBlog(blog): Observable<any> {
    const url = `/blog/publish/`;
    return this.api.apiPost(url, blog);
  }

  getBlogList(pageNum, pageSize): Observable<any> {
    const url = `/blog/list/${pageNum}/${pageSize}`;
    return this.api.apiGet(url);
  }

  getBlogDetail(blogId): Observable<any> {
    const url = `/blog/${blogId}/`;
    return this.api.apiGet(url);
  }

}
