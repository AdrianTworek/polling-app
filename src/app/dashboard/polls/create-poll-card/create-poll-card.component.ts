import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PollType } from '../../../shared/types';

import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-poll-card',
  imports: [CardModule, DialogModule],
  templateUrl: './create-poll-card.component.html',
})
export class CreatePollCardComponent {
  private router = inject(Router);

  visible = false;
  pollType = PollType;

  showDialog() {
    this.visible = true;
  }

  onRedirectToPollCreator(pollType: PollType) {
    this.router.navigate(['dashboard/polls/new'], {
      queryParams: { type: pollType },
    });
  }
}
