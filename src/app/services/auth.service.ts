import {Injectable} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {ApiResponse, extractData} from './api-response'
import {ApiService} from './api.service'
import {map, tap} from 'rxjs/operators'
import {BehaviorSubject, Observable} from 'rxjs'

export class User {
  id = ''
  name = ''
  email = ''
  slogan = ''
  avatar = ''
  token = ''
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<User | null>
  private currentUserSubject: BehaviorSubject<User | null>
  private userKey = 'currentUser'

  constructor(private api: ApiService, private matSnackBar: MatSnackBar) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      // TODO: JSON.parse(localStorage.getItem(this.userKey) || '')
      null
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get user(): User | null {
    return this.currentUserSubject.value
  }

  logIn(username: string, password: string) {
    // TODO: hash password
    return this.api
      .apiPost<ApiResponse<User>>('/blog/auth/', {username, password})
      .pipe(
        map((response) => extractData(response)),
        tap((user: User) => {
          this.matSnackBar.open(`Hello, ${user.name}~`, 'Ok', {duration: 2000})
          localStorage.setItem(this.userKey, JSON.stringify(user))
          this.currentUserSubject.next(user)
        })
      )
  }

  logout() {
    this.matSnackBar.open(`Goodbye, ${this.user?.name}~`, 'Ok', {
      duration: 2000
    })
    localStorage.removeItem(this.userKey)
    this.currentUserSubject.next(null)
  }
}
