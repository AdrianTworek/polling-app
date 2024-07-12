import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollType } from '../../../shared/types';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-poll-creator',
  standalone: true,
  imports: [ButtonModule],
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
