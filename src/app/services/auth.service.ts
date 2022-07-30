import {Injectable} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {ApiService} from './api.service'
import {tap} from 'rxjs/operators'
import {BehaviorSubject, Observable} from 'rxjs'

export class User {
  id: number
  name: string
  email: string
  slogan: string
  avatar: string
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<User>
  private currentUserSubject: BehaviorSubject<User>
  private userKey = 'currentUser'
  private prevUser: User = null

  constructor(
    private api: ApiService,
    private matSnackBar: MatSnackBar
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(this.userKey)))
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get user(): User {
    return this.currentUserSubject.value
  }

  logIn(username, password) {
    // TODO: hash password
    return this.api.apiPost('/blog/auth/', {username, password}).pipe(
      tap((user: any) => {
        this.matSnackBar.open(`Hello, ${user.name}~`, 'Ok', {duration: 2000})
        localStorage.setItem(this.userKey, JSON.stringify(user))
        this.currentUserSubject.next(user)
        return user
      })
    )
  }

  logout() {
    this.matSnackBar.open(`Goodbye, ${this.user.name}~`, 'Ok', {duration: 2000})
    localStorage.removeItem(this.userKey)
    this.currentUserSubject.next(null)
  }
}
