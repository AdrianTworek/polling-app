import { Component, input, inject, DestroyRef } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PollsService } from '../polls.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Poll } from '../poll.model';
import { PollType } from '../../../shared/types';

import { CardWrapperComponent } from '../../../shared/components/card-wrapper/card-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-user-poll-card',
  standalone: true,
  imports: [
    DatePipe,
    TruncatePipe,
    UpperCasePipe,
    CardWrapperComponent,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './user-poll-card.component.html',
})
export class UserPollCardComponent {
  poll = input.required<Poll>();
  pollType = PollType;

  private messageService = inject(MessageService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private pollsService = inject(PollsService);
  private destroyRef = inject(DestroyRef);

  copyPollLinkToClipboard(event: Event) {
    event.stopPropagation();

    const pollLink = `${window.location.origin}/polls/${this.poll().id}/vote`;
    navigator.clipboard.writeText(pollLink).then(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Poll link copied to clipboard',
        });
      },
      (err) => {
        console.error('Could not copy text:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to copy poll link',
        });
      },
    );
  }

  navigateToPoll() {
    this.router.navigate(['/polls', this.poll().id]);
  }

  confirmDeletePoll(event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this poll?',
      header: 'Confirmation',
      icon: 'pi pi-trash',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'No',
      acceptLabel: 'Yes, delete',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.pollsService
          .deletePoll(this.poll().id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Poll successfully deleted',
              });
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Failed to delete poll',
                detail: err.message,
              });
            },
          });
      },
      reject: () => {},
    });
  }
}
