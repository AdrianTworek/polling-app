import { Component, computed, inject, input, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { PollsService } from '../polls.service';
import { ObsWithStatusPipe } from '../../../shared/pipes/obs-with-status.pipe';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { GoBackButtonComponent } from '../../../shared/components/go-back-button/go-back-button.component';
import { CardWrapperComponent } from '../../../shared/components/card-wrapper/card-wrapper.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

interface ChartType {
  value: 'pie' | 'doughnut';
  label: string;
}

@Component({
  selector: 'app-poll-details',
  imports: [
    AsyncPipe,
    ObsWithStatusPipe,
    DatePipe,
    RouterLink,
    FormsModule,
    NotFoundComponent,
    ButtonModule,
    ProgressSpinnerModule,
    GoBackButtonComponent,
    CardWrapperComponent,
    DropdownModule,
    ChartModule,
  ],
  templateUrl: './poll-details.component.html',
})
export class PollDetailsComponent {
  pollId = input.required<string>();

  private pollsService = inject(PollsService);

  poll$ = toObservable(this.pollId).pipe(
    switchMap((id) => this.pollsService.getPollWithAuthor(id)),
  );

  chartTypes = signal<ChartType[]>([
    { value: 'pie', label: 'Pie' },
    { value: 'doughnut', label: 'Doughnut' },
  ]);

  selectedChartType = signal<ChartType>({
    value: 'pie',
    label: 'Pie',
  });

  private pollSig = toSignal(this.poll$);
  hasVotes = computed(() =>
    this.pollSig()?.options.some((option) => option.votes > 0),
  );

  getChartData = computed(() => {
    // Enforce rerender of chart when selectedChartType changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chartType = this.selectedChartType();
    const poll = this.pollSig();

    if (!poll) {
      return null;
    }

    return {
      labels: poll.options.map((option) => option.value),
      datasets: [
        {
          data: poll.options.map((option) => option.votes),
        },
      ],
    };
  });
}
