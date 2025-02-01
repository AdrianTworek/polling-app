import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isRegisterMode = signal(false);
  isLoading = signal(false);

  authForm = this.fb.nonNullable.group({
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

  private formatErrorMessage(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid credentials';
      case 'auth/email-already-in-use':
        return 'This email is already in use';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long';
      default:
        return 'Please try again';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          detail: this.formatErrorMessage(error.code),
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

      if (this.isRegisterMode()) {
        this.authResultHandler(
          this.authService.registerWithEmailAndPassword(
            this.authForm.value.email!,
            this.authForm.value.password!,
          ),
        );
      } else {
        this.authResultHandler(
          this.authService.loginWithEmailAndPassword(
            this.authForm.value.email!,
            this.authForm.value.password!,
          ),
        );
      }
    }
  }

  onToggleFormMode() {
    this.isRegisterMode.set(!this.isRegisterMode());
    this.authForm.reset();
  }
}
