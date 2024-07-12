import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-username-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './username-form.component.html',
})
export class UsernameFormComponent {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.currentUser.asReadonly();
  isLoading = signal(false);

  usernameForm = this.fb.nonNullable.group({
    username: [
      this.authService.currentUser()?.displayName,
      [Validators.required],
    ],
  });

  get username() {
    return this.usernameForm.controls.username;
  }

  onSubmit() {
    if (this.usernameForm.valid) {
      this.isLoading.set(true);

      const subscription = this.authService
        .updateUsername(this.usernameForm.value.username!)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Username successfully updated',
            });
            this.isLoading.set(false);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Something went wrong',
              detail: error,
            });
          },
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
