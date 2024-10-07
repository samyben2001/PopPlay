import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  accountServ = inject(AccountService);
  authServ = inject(AuthService);
  router = inject(Router);
  loginForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // Using FormBuilder to create the FormGroup.
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Define the default value and validators inside the array
      password: ['', [Validators.required]],
    });
  }

  submit() {
    // send login request to api
    if (this.loginForm.valid) {
      this.accountServ.login(this.loginForm.value).subscribe({
        next: (token) => { // login successful
          this.authServ.setToken(token);
          this.router.navigate(['/']);
        },
        error: (err) => { // login failed
          console.log('Error encountered during login');
          console.log(err);
        }
      });
    }
  }
}
