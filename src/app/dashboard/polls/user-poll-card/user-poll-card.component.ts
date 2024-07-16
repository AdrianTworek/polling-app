import { Component, input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';

import { CardWrapperComponent } from '../../../shared/components/card-wrapper/card-wrapper.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Poll } from '../poll.model';
import { PollType } from '../../../shared/types';

@Component({
  selector: 'app-user-poll-card',
  standalone: true,
  imports: [DatePipe, TruncatePipe, UpperCasePipe, CardWrapperComponent],
  templateUrl: './user-poll-card.component.html',
})
export class UserPollCardComponent {
  poll = input.required<Poll>();

  pollType = PollType;
}
