import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { checkPasswordIdenticalValidator } from '../../../shared/validators/checkPasswordIdenticalValidator';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/api/auth.service';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../services/api/account.service';
import { BtnTypes } from '../../../enums/BtnTypes';
import { ButtonComponent } from '../../../shared/components/tools/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, InputTextModule,PasswordModule, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  authServ = inject(AuthService);
  accountServ = inject(AccountService);
  router = inject(Router);
  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  btnTypes = BtnTypes
  
  subscription: Subscription = new Subscription();
  StrongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$=.])[A-Za-z\d!@#$=.]{8,}$/; // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,.)

  constructor() {}

  ngOnInit(): void {
    // Using FormBuilder to create the FormGroup.
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]],
      password2: ['', [Validators.required]],
    },{
      validators: [checkPasswordIdenticalValidator] 
    });
  }

  submit() {
    // send registration request to api
    if (this.registerForm.valid) {
      this.subscription = this.authServ.register(this.registerForm.value).subscribe({
        next: (token) => { // Registration successful
          this.authServ.setToken(token);
          this.accountServ.setAccount(this.authServ.getConnectedUser()!);
          this.router.navigate(['/']);
        },
        error: (err) => { // Registration failed
          console.log('Error encountered during registration');
          console.log(err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
