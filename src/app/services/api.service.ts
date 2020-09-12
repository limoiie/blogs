import {Injectable} from '@angular/core';
import {HttpClient, HttpXsrfTokenExtractor} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  restUrl = '/api';

  constructor(
    private http: HttpClient,
    private httpXsrfTokenExtractor: HttpXsrfTokenExtractor
  ) {
  }

  apiGet(url, opt?) {
    return this.http.get(`${this.restUrl}${url}`, opt);
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

}
