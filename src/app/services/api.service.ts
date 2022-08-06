import {Injectable} from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpXsrfTokenExtractor
} from '@angular/common/http'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  restUrl = '/api'

  constructor(
    private http: HttpClient,
    private httpXsrfTokenExtractor: HttpXsrfTokenExtractor
  ) {}

  apiGet<T>(
    url: string,
    opt?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[]
          }
      observe?: 'body'
      params?:
        | HttpParams
        | {
            [param: string]: string | string[]
          }
      reportProgress?: boolean
      responseType?: 'json'
      withCredentials?: boolean
    }
  ): Observable<T> {
    return this.http.get<T>(`${this.restUrl}${url}`, opt)
  }

  apiPost<T>(
    url: string,
    data: any | null,
    opt?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[]
          }
      observe?: 'body'
      params?:
        | HttpParams
        | {
            [param: string]: string | string[]
          }
      reportProgress?: boolean
      responseType?: 'json'
      withCredentials?: boolean
    }
  ): Observable<T> {
    return this.http.post<T>(`${this.restUrl}${url}`, data, {
      ...this.addCsrfHeader(opt)
    })
  }

  requestCsrfToken() {
    return this.http.get('/api/blog/csrftoken/', {
      observe: 'body',
      responseType: 'text'
    })
  }

  private addCsrfHeader(opt: any): object {
    opt = opt || {}
    opt.headers = opt.headers || {}

    opt.headers['X-CSRFToken'] = this.httpXsrfTokenExtractor.getToken()
    opt.withCredentials = true
    return opt
  }
}
