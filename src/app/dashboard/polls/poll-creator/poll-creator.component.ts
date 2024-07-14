import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollType } from '../../../shared/types';

import { ButtonModule } from 'primeng/button';
import { NewAnonymousPollComponent } from './new-anonymous-poll/new-anonymous-poll.component';
import { NewPublicPollComponent } from './new-public-poll/new-public-poll.component';

@Component({
  selector: 'app-poll-creator',
  standalone: true,
  imports: [ButtonModule, NewAnonymousPollComponent, NewPublicPollComponent],
  templateUrl: './poll-creator.component.html',
})
export class PollCreatorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  PollType = PollType;
  pollType = signal<PollType>(PollType.Anonymous);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.pollType.set(params['type']);
    });
  }

  onGoBack() {
    this.router.navigate(['../'], {
      relativeTo: this.route,
    });
  }
}
