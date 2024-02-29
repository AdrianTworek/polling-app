import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-delete-profile',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './delete-profile.component.html',
  providers: [ConfirmationService, MessageService],
})
export class DeleteProfileComponent {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to proceed? After deleting your account you will lose all your data.`,
      header: 'Delete account',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.authService.deleteAccount().subscribe({
          next: () => {
            this.authService.logOut().then(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Your account has been deleted',
                detail:
                  'Thank you for using our app! You will be redirected to home page...',
                life: 3000,
              });
              setTimeout(() => {
                this.router.navigate(['/auth']);
              }, 3000);
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'danger',
              summary: 'Something went wrong',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Good decision :)',
          detail: 'Thank you for staying with us!',
          life: 3000,
        });
      },
    });
  }
}
