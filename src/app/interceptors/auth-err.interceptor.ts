import {Injectable} from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {AuthService} from '../services/auth.service'
import {catchError} from 'rxjs/operators'

@Injectable()
export class AuthErrInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authService.logout()
          location.reload()
        }

        const error = err.error.message || err.statusText
        return throwError(error)
      })
    )
  }
}
