import {Component, OnInit} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'
import {MatDialogRef} from '@angular/material/dialog'
import {MatSnackBar} from '@angular/material/snack-bar'
import {Router} from '@angular/router'
import {ApiService} from '../services/api.service'
import {AuthService} from '../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true
  csrfToken = ''
  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit(): void {
    this.apiService.requestCsrfToken().subscribe((msg) => {
      console.log(`Response for CSRFTOKEN Request is: ${msg}`)
      this.csrfToken = msg
    })
  }

  onSubmit() {
    const value = Object.assign({}, this.form.value)
    this.authService.logIn(value.username, value.password).subscribe({
      next: (_user) => {
        this.dialogRef.close(true)
        this.router.navigate(['']).then()
      },
      error: (err) => this.snackBar.open(`Failed to login: ${err}`, 'Ok')
    })
  }
}
