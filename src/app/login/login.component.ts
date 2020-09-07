import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {ApiResponse} from '../services/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const value = Object.assign({}, this.form.value);
    this.authService.logIn(value.username, value.password)
      .subscribe((response: ApiResponse) => {
        if (response.state) {
          this.router.navigate(['']).then();
        } else {
          const msg = `Failed to login: ${response.message}`;
          this.snackBar.open(msg, '', {duration: 3000});
        }
      });
  }
}
