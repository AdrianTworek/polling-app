import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  private signUpWithProviderHandler(promise: Promise<void>) {
    promise
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully logged in',
        });
        this.router.navigate(['/dashboard']);
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'Please try again',
        });
      });
  }

  onSignUpWithGoogle() {
    this.signUpWithProviderHandler(this.authService.signUpWithGoogle());
  }

  onSignUpWithGitHub() {
    this.signUpWithProviderHandler(this.authService.signUpWithGithub());
  }
}
