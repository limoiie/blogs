import {Component} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'
import {MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {Router} from '@angular/router'
import {AuthService} from '../services/auth.service'

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
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
  }

  onSubmit() {
    const value = Object.assign({}, this.form.value)
    this.authService.logIn(value.username, value.password).subscribe({
      next: () => {
        this.dialogRef.close(true)
        this.router.navigate(['']).then()
      },
      error: (err) => this.snackBar.open(`Failed to login: ${JSON.stringify(err)}`, 'Ok'),
      complete: () => {
        this.dialogRef.close(true)
      }
    })
  }
}
