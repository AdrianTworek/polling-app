import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CardWrapperComponent } from '../../profile/card-wrapper/card-wrapper.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Poll } from '../poll.model';

@Component({
  selector: 'app-user-poll-card',
  standalone: true,
  imports: [DatePipe, TruncatePipe, CardWrapperComponent],
  templateUrl: './user-poll-card.component.html',
})
export class UserPollCardComponent {
  poll = input.required<Poll>();
}
