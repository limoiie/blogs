import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private http: HttpClient
  ) { }

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

}
