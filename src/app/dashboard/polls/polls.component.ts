import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { PollsService } from './polls.service';
import { CreatePollCardComponent } from './create-poll-card/create-poll-card.component';
import { Poll } from './poll.model';
import { CardWrapperComponent } from '../../shared/components/card-wrapper/card-wrapper.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { UserPollCardComponent } from './user-poll-card/user-poll-card.component';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    TruncatePipe,
    CreatePollCardComponent,
    CardWrapperComponent,
    UserPollCardComponent,
  ],
  templateUrl: './polls.component.html',
})
export class PollsComponent {
  private pollsService = inject(PollsService);
  polls$: Observable<Poll[]>;

  constructor() {
    this.polls$ = this.pollsService.getUserPolls();
  }
}
