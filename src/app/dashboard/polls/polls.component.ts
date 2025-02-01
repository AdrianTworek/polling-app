import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { PollsService } from './polls.service';
import { CreatePollCardComponent } from './create-poll-card/create-poll-card.component';
import { UserPollCardComponent } from './user-poll-card/user-poll-card.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ObsWithStatusPipe } from '../../shared/pipes/obs-with-status.pipe';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';

@Component({
  selector: 'app-polls',
  imports: [
    AsyncPipe,
    ObsWithStatusPipe,
    CreatePollCardComponent,
    UserPollCardComponent,
    ProgressSpinnerModule,
    NotFoundComponent,
  ],
  templateUrl: './polls.component.html',
})
export class PollsComponent {
  private pollsService = inject(PollsService);

  polls$ = this.pollsService.getUserPolls();
}
