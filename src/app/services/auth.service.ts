import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {TokenAndProfileUser, User, WithFullProfileUser} from '../beans/user'
import {ApiService} from './api.service'

const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mTokenUser: TokenAndProfileUser | undefined

  private loggedInUser$$ = new BehaviorSubject<WithFullProfileUser | undefined>(undefined)
  loggedInUser$ = this.loggedInUser$$.asObservable()

  constructor(
    private api: ApiService
  ) {
    this.load()
    this.loggedInUser$$.next(this.mTokenUser?.user)
  }

  get hasLoggedIn(): boolean {
    return this.mTokenUser != undefined
  }

  get token(): string | undefined {
    return this.mTokenUser?.token
  }

  get loggedInUser(): User | undefined {
    return this.mTokenUser?.user
  }

  logIn(username: string, password: string): Observable<TokenAndProfileUser> {
    return this.api.apiPost<TokenAndProfileUser>('/login', {
      username,
      password
    }).pipe(
      tap(tokenAndUser => {
        this.mTokenUser = tokenAndUser
        this.loggedInUser$$.next(tokenAndUser.user)
        this.save()
      })
    )
  }

  logout() {
    this.mTokenUser = undefined
    this.loggedInUser$$.next(undefined)
    window.sessionStorage.clear()
  }

  private load(): TokenAndProfileUser | undefined {
    const token = window.sessionStorage.getItem(TOKEN_KEY)
    const user = window.sessionStorage.getItem(USER_KEY)
    if (token && user) {
      return new TokenAndProfileUser(token, JSON.parse(user))
    }
    return undefined
  }

  private save() {
    window.sessionStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.removeItem(USER_KEY)

    if (this.mTokenUser) {
      window.sessionStorage.setItem(TOKEN_KEY, this.mTokenUser.token)
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(this.mTokenUser.user))
    }
  }
}
