import {Injectable} from '@angular/core'
import {AuthService} from './auth.service'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUser) {
      return true
    }

    this.router
      .navigate(['/login'], {
        queryParams: {returnUrl: state.url}
      })
      .then()
    return false
  }
}
