import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  restUrl = '/api'

  constructor(
    private http: HttpClient
  ) {
  }

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
    // eslint-disable-next-line
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
    return this.http.post<T>(`${this.restUrl}${url}`, data, opt)
  }
}
