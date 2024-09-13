import { Component, input, inject } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Poll } from '../poll.model';
import { PollType } from '../../../shared/types';

import { CardWrapperComponent } from '../../../shared/components/card-wrapper/card-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

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
  ],
  templateUrl: './user-poll-card.component.html',
})
export class UserPollCardComponent {
  poll = input.required<Poll>();
  pollType = PollType;

  private messageService = inject(MessageService);
  private router = inject(Router);

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
}
