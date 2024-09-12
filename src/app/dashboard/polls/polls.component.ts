import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';

import { PollsService } from './polls.service';
import { CreatePollCardComponent } from './create-poll-card/create-poll-card.component';
import { CardWrapperComponent } from '../../shared/components/card-wrapper/card-wrapper.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { UserPollCardComponent } from './user-poll-card/user-poll-card.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ObsWithStatusPipe } from '../../shared/pipes/obs-with-status.pipe';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    TruncatePipe,
    ObsWithStatusPipe,
    CreatePollCardComponent,
    CardWrapperComponent,
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
