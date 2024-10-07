import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { checkPasswordIdenticalValidator } from '../../../shared/validators/checkPasswordIdenticalValidator';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  accountServ = inject(AccountService);
  router = inject(Router);
  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  StrongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$.])[A-Za-z\d!@#$.]{8,}$/; // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,.)

  constructor() {}

  ngOnInit(): void {
    // Using FormBuilder to create the FormGroup.
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Define the default value and validators inside the array
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]],
      password2: ['', [Validators.required]],
    },{
      validator: [checkPasswordIdenticalValidator] 
    });
  }

  submit() {
    // send registration request to api
    if (this.registerForm.valid) {
      this.accountServ.register(this.registerForm.value).subscribe({
        next: (token) => { // Registration successful
          console.log('Registered successfully');
          console.log(token);
          this.router.navigate(['/']);
        },
        error: (err) => { // Registration failed
          console.log('Error encountered during registration');
          console.log(err);
        }
      });
    }
  }
}
