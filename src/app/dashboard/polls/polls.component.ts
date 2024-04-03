import { Component } from '@angular/core';

import { CreatePollCardComponent } from './create-poll-card/create-poll-card.component';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [CreatePollCardComponent],
  templateUrl: './polls.component.html',
})
export class PollsComponent {}
