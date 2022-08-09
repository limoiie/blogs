import {Component} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'
import {MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {Router} from '@angular/router'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  isPasswordHidden = true

  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })

  constructor(
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
  }

  onSubmit() {
    const value = Object.assign({}, this.form.value)
    this.authService.logIn(value.username, value.password)
      .subscribe({
        next: () => this.router.navigate(['']).then(),
        error: (err) => {
          switch (err.status) {
          case 403:
            this.snackBar.open('Failed to login: wrong username or wrong password', 'Ok')
            break
          default:
            this.snackBar.open(`Failed to login: ${err}`, 'Ok')
          }
        },
        complete: () => this.dialogRef.close(true)
      })
  }
}
