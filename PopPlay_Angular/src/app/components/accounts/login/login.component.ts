import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/api/account.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/api/auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FloatLabelModule,InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  authServ = inject(AuthService);
  accountServ = inject(AccountService);
  router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  errorLogin: string ='';
  subscription: Subscription = new Subscription();

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
      this.authServ.login(this.loginForm.value).subscribe({
        next: (token) => { // login successful
          this.authServ.setToken(token);
          this.accountServ.setAccount(this.authServ.getConnectedUser()!)
          this.router.navigate(['/']);
        },
        error: (err) => { // login failed
          console.log('Error encountered during login');
          console.log(err)
          this.errorLogin = err.error.detail;
        }
      });
    }
  }
  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
