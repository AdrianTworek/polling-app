import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isRegisterModeSig = signal(false);
  isLoading = signal(false);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
    ],
  });

  get email() {
    return this.authForm.controls.email;
  }

  get password() {
    return this.authForm.controls.password;
  }

  private authResultHandler(promise: Promise<any>) {
    promise
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully logged in',
        });
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.authForm.reset();
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: error,
        });
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  onSignUpWithGoogle() {
    this.authResultHandler(this.authService.signUpWithGoogle());
  }

  onSignUpWithGitHub() {
    this.authResultHandler(this.authService.signUpWithGithub());
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading.set(true);

      if (this.isRegisterModeSig()) {
        this.authResultHandler(
          this.authService.registerWithEmailAndPassword(
            this.authForm.value.email!,
            this.authForm.value.password!
          )
        );
      } else {
        this.authResultHandler(
          this.authService.loginWithEmailAndPassword(
            this.authForm.value.email!,
            this.authForm.value.password!
          )
        );
      }
    }
  }

  onToggleFormMode() {
    this.isRegisterModeSig.set(!this.isRegisterModeSig());
    this.authForm.reset();
  }
}
