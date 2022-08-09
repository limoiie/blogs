import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {TokenAndProfileUser, User, WithFullProfileUser} from '../beans/user'
import {ApiService} from './api.service'

const REMEMBER_ME_KEY = 'auth-rememberMe'
const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mRememberMe = false
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

  get rememberMe(): boolean {
    return this.mRememberMe
  }

  get storage(): Storage {
    return this.mRememberMe ? window.localStorage : window.sessionStorage
  }

  logIn(username: string, password: string)
    : Observable<TokenAndProfileUser> {
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
    this.clear()
  }

  toggleRememberMe() {
    this.mRememberMe = !this.mRememberMe
    window.localStorage.setItem(REMEMBER_ME_KEY, this.mRememberMe.toString())
  }

  private load() {
    this.mRememberMe = window.localStorage.getItem(REMEMBER_ME_KEY) == 'true'

    const token = this.storage.getItem(TOKEN_KEY)
    const user = this.storage.getItem(USER_KEY)
    if (token && user) {
      this.mTokenUser = new TokenAndProfileUser(token, JSON.parse(user))
    }
  }

  private save() {
    if (this.mTokenUser) {
      this.storage.setItem(TOKEN_KEY, this.mTokenUser.token)
      this.storage.setItem(USER_KEY, JSON.stringify(this.mTokenUser.user))
    }
  }

  private clear() {
    window.localStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    window.sessionStorage.removeItem(USER_KEY)
  }
}
